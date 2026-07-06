# Software Requirements Specification (SRS) - High Level

## 1. Project Scope
The Latter Rain Tabernacle (LRT) Church Management Platform is a digital ecosystem designed to streamline church administration, enhance communication, and foster community engagement. 
The system will manage content (sermons, blog, gallery, announcements), schedule events, facilitate prayer requests, and provide role-based access for church members, staff, and visitors. 

## 2. Identified Stakeholders
- **Church Leadership/Pastors:** Primary decision-makers, content publishers.
- **Administrators/Staff:** Day-to-day managers of events, members, and content.
- **Church Members:** End-users accessing the member portal.
- **Visitors:** Public users exploring the website.
- **Development Team:** Mentee and Tech Lead.

## 3. High-Level Requirements Overview
*Note: Detailed Functional and Non-Functional Requirements will be established in Phase 2.*

### 3.1 Key Modules
- **Authentication & Authorization:** JWT with Role-Based Access Control (Admin, Pastor, Editor, Member, Visitor).
- **Member Management:** Profiles, roles, and communication.
- **Content Management:** Sermons (audio/video, notes), Blog, Gallery, Announcements.
- **Event Management:** Department-specific scheduling and event registration.
- **Communication:** Prayer requests, contact forms, notifications.
- **Financial (Future-Proofing):** Initial support for MTN/Orange Money, structured for future integration with payment gateways (Stripe, PayPal, etc.).

### 3.2 Constraints & Assumptions
- **Storage:** Local file system via Multer for initial media storage, transitioning to Cloud (AWS S3) in the future.
- **Database:** MongoDB Community running locally.
- **Tech Stack:** MERN stack with TypeScript (Strict mode).
- **Design:** Modern, minimalist, accessible design adhering to Royal Blue and Gold color schemes.
