'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useUser } from '../provider';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/* Internal implementation of Query:
  https://github.com/firebase/firebase-js-sdk/blob/c5f08a9bc5da0d2b0207802c972d53724ccef055/packages/firestore/src/lite-api/reference.ts#L143
*/
export interface InternalQuery extends Query<DocumentData> {
  _query: {
    path: {
      canonicalString(): string;
      toString(): string;
    }
  }
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * Handles nullable references/queries.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
): UseCollectionResult<T> {
  const { user } = useUser();
  type ResultItemType = WithId<T>;
  type StateDataType = ResultItemType[] | null;

  const [data, setData] = useState<StateDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  // Helper function to check if a path is a public collection
  const isPublicCollection = (path: string): boolean => {
    const publicCollections = ['offers', 'recursos', 'rankings', 'stats'];
    return publicCollections.some(collection => path.includes(collection));
  };

  useEffect(() => {
    // Reset state when query changes
    setData(null);
    setError(null);
    setIsLoading(true);

    // CRITICAL: Return early if no query reference
    if (!memoizedTargetRefOrQuery) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Get the path for error handling
    let path = '';
    try {
      path = memoizedTargetRefOrQuery.type === 'collection'
        ? (memoizedTargetRefOrQuery as CollectionReference).path
        : (memoizedTargetRefOrQuery as unknown as InternalQuery)._query.path.canonicalString();
    } catch (e) {
      path = 'unknown';
    }

    const isPublic = isPublicCollection(path);

    // For non-public collections, wait for user authentication
    if (!isPublic && !user) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const unsubscribe = onSnapshot(
      memoizedTargetRefOrQuery,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: ResultItemType[] = [];
        for (const doc of snapshot.docs) {
          results.push({ ...(doc.data() as T), id: doc.id });
        }
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (error: FirestoreError) => {
        // robust permission error check
        const isPermissionError = error.code === 'permission-denied' || 
                                 error.message?.includes('Missing or insufficient permissions');

        // For public collections, don't treat permission errors as fatal
        if (isPermissionError && isPublic) {
          console.warn(`Permission denied for public collection "${path}". Showing empty data. Check Firestore rules.`);
          setData([]); // Empty array instead of null to avoid UI issues
          setError(null); // No error for public collections
          setIsLoading(false);
          return;
        }

        // For non-public collections, check if it's due to missing auth
        if (isPermissionError && !user) {
          console.debug('Firestore permission denied while user not authenticated - deferring error');
          setData(null);
          setIsLoading(false);
          return;
        }

        // Create contextual error for other cases
        const contextualError = new FirestorePermissionError({
          operation: 'list',
          path,
        });

        setError(contextualError);
        setData(null);
        setIsLoading(false);

        // Only emit global error for non-public collections
        if (!isPublic) {
          errorEmitter.emit('permission-error', contextualError);
        }
      }
    );

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery, user]);

  if(memoizedTargetRefOrQuery && !memoizedTargetRefOrQuery.__memo) {
    throw new Error(memoizedTargetRefOrQuery + ' was not properly memoized using useMemoFirebase');
  }
  return { data, isLoading, error };
}