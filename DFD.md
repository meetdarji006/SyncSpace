# Data Flow Diagram (DFD) - SyncSpace

This document outlines the Data Flow Diagrams for the SyncSpace application.

## Level 0: Context Diagram

This diagram represents the entire SyncSpace system as a single process interacting with external entities.

```mermaid
graph TD
    User[User]
    Cloudinary[External: Cloudinary]
    System(SyncSpace System)

    User -- "Credentials, Profile Data" --> System
    User -- "Message Content, Call Signals" --> System
    User -- "File Attachments" --> System

    System -- "Auth Token, User Data" --> User
    System -- "Real-time Messages, Notifications" --> User
    System -- "Video/Audio Stream Signals" --> User

    System -- "File Data" --> Cloudinary
    Cloudinary -- "File URL" --> System
```

## Level 1: DFD

This diagram breaks down the SyncSpace system into its major sub-processes.

```mermaid
graph TD
    %% Entities
    User[User]
    Cloudinary[External: Cloudinary]

    %% Processes
    P1(1.0 Authentication)
    P2(2.0 Organization Mgmt)
    P3(3.0 Channel Mgmt)
    P4(4.0 Messaging System)
    P5(5.0 File Upload)
    P6(6.0 Video Signaling)

    %% Data Stores
    D1[(Users / Profiles)]
    D2[(Organizations)]
    D3[(Channels)]
    D4[(Messages / DMs)]

    %% Flows

    %% Auth
    User -- "Login/Signup Info" --> P1
    P1 -- "Verify/Create" --> D1
    D1 -- "User Data" --> P1
    P1 -- "Auth Token" --> User

    %% Org Mgmt
    User -- "Create/Join Org" --> P2
    P2 -- "Save Org Info" --> D2
    P2 -- "Add Member" --> D2
    D2 -- "Org Data" --> P2
    P2 -- "Org List" --> User

    %% Channel Mgmt
    User -- "Create Channel" --> P3
    P3 -- "Save Channel" --> D3
    D3 -- "Channel Details" --> P3
    P3 -- "Channel List" --> User
    D2 -.-> P3

    %% Messaging
    User -- "Send Message" --> P4
    P4 -- "Save Message" --> D4
    D4 -- "History" --> P4
    P4 -- "Broadcast Message (Socket.io)" --> User

    %% File Upload
    User -- "Upload File" --> P5
    P5 -- "File Buffer" --> Cloudinary
    Cloudinary -- "Secure URL" --> P5
    P5 -- "Attachment URL" --> P4

    %% Video
    User -- "Join Call / Offer / Answer" --> P6
    P6 -- "Route Signal (Socket.io)" --> User
```

## Process Descriptions

### 1.0 Authentication
Handles user registration and login via Supabase (or internal logic). Manages user profiles.
*   **Inputs**: Email, Password, Name.
*   **Outputs**: JWT/Session Token, User Profile.

### 2.0 Organization Management
Allows users to create new organizations or join existing ones. Manages organization members and roles.
*   **Inputs**: Org Name, Description.
*   **Outputs**: Organization Object, Member List.

### 3.0 Channel Management
Manages creation and retrieval of channels within an organization. Supports hierarchical (parent/child) channels.
*   **Inputs**: Channel Name, Parent Channel ID.
*   **Outputs**: Channel List.

### 4.0 Messaging System
The core communication engine. Handles storing messages in PostgreSQL (Drizzle) and broadcasting them in real-time via Socket.io. Supports both Channel messages and Direct Messages.
*   **Inputs**: Content, ChannelID/ReceiverID, Attachment URL.
*   **Outputs**: Message Object, Real-time Event.

### 5.0 File Upload
Handles file attachments for messages. Receives files from the client, uploads them to Cloudinary, and returns a URL.
*   **Inputs**: File Blob.
*   **Outputs**: Cloudinary URL, File Type.

### 6.0 Video Signaling
Manages WebRTC signaling for video calls. Does not store video streams but relays connection signals (Offers, Answers, ICE Candidates) between peers.
*   **Inputs**: Peer ID, SDP Signal.
*   **Outputs**: Relayed Signal.
