# **App Name**: SportMatch AI

## Core Features:

- User Role-Based Profile Creation: Users (players, coaches, clubs) can create and manage their basic and detailed profiles, including roles, disciplines, and professional history, with data efficiently structured across Firestore collections.
- Advanced Talent Search & Filtering: Users can search and filter for players, coaches, or clubs using criteria like discipline, role, status, and province, with results ranked by relevance 'score' using optimized Firestore queries.
- AI-Generated Profile Insights: Utilizing Genkit and Gemini, the AI acts as a tool to generate concise 'summary' and detailed 'analysis' for user profiles, enriching data stored in Firestore for deeper insights.
- Professional Certification Verification Workflow: A UI flow for users to submit professional credentials for verification. Upon internal approval, their 'verificationStatus' in Firestore is updated, enhancing profile credibility.
- Secure Match Request & Acceptance System: Users can send match requests to other profiles. Upon acceptance, a state change in Firestore grants both parties access to sensitive contact details from the 'privateProfiles' collection.
- Detailed Dual-Layer Profile Viewing: Allow viewing comprehensive profiles of other users, including bios, team history, videos, and AI-generated insights, by efficiently loading data from both 'users' and 'userProfiles' Firestore collections.

## Style Guidelines:

- Color Scheme: A clean and energetic light theme suitable for professional sports platforms.
- Primary color: A vibrant yet professional blue (#2689D9) that conveys intelligence, trust, and dynamism for main actions and branding.
- Background color: A very subtle, almost neutral light greyish-blue (#EFF3F6) to maintain focus on content while subtly complementing the primary hue.
- Accent color: A lively and contrasting aquamarine/cyan (#4CE6E6) to highlight calls to action and create visual excitement, ensuring strong contrast against the primary.
- Headline font: 'Space Grotesk' (sans-serif) for its modern, techy, and impactful feel, aligning with the platform's AI and data focus.
- Body text font: 'Inter' (sans-serif) for its highly legible, objective, and versatile characteristics, ideal for clear display of professional information.
- Utilize modern, clean, and contextually relevant icons for sports (e.g., soccer ball, whistle) and data/AI functionalities (e.g., gears, network nodes). Use outlined or minimalist solid styles to maintain professionalism.
- Adopt a mobile-first, card-based layout approach. Ensure ample negative space, clear visual hierarchy, and intuitive navigation with well-defined interactive elements suitable for touch devices.
- Implement subtle, fast-response animations for transitions between search results and profile views. Use gentle hover effects on interactive elements to provide clear user feedback without distracting from the content.