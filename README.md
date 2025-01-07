# QueHoras - Scheduling App

QueHoras is a modern scheduling application built with React, utilizing the efficiency of Vite and the state management capabilities of Redux Toolkit. This app simplifies the
process of creating and managing appointments.

## Features

-   Create, update, and delete appointments.
-   View appointments in a daily, weekly, or monthly calendar.
-   Receive email notifications for upcoming appointments.
-   User authentication and management.
-   Responsive design for desktop and mobile devices.

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   Node.js (version 20.9.0 or higher)
-   Yarn package manager

## Installation

To install QueHoras, follow these steps:

1. Clone the repository:

```
git clone https://github.com/your-username/quehoras.git
cd quehoras
```

2. Install the dependencies with Yarn:

```
yarn install
```

3. Start the development server:

```
yarn dev
```

# Domain-Driven Folder Structure

Implementing Domain-Driven Design in React projects involves organizing the codebase around the business domain. This approach enhances understanding and cooperation between
developers and domain experts, leading to software that more accurately reflects the business requirements.

## Principles of DDD in Folder Structure

DDD emphasizes the importance of a model that reflects the real-world business domain. In terms of folder structure, this means:

-   Grouping by business concepts rather than technical concerns.
-   Reflecting the ubiquity language of the business domain in the directory and file names.
-   Encapsulating the domain logic within these directories.
