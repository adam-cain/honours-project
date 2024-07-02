# Auto Flow Platform

Auto Flow is a user-friendly platform designed to streamline the creation and deployment of automation tools using large language models (LLMs). This platform enables users to build complex workflows and interactive chatbots with minimal technical expertise through a node-based editor and integrated development environment.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Future Work](#future-work)

## Features

- **Node-Based Editor**: Create and execute workflows visually using React Flow.
- **Customizable Chatbots**: Design chatbot interfaces with customization options for aesthetics and functionality.
- **Code Compilation and Execution**: Extend platform capabilities with custom scripts securely executed in isolated environments.
- **User Authentication and Authorization**: Secure login and registration system with NextAuth.js and extternal OAuth providers.
- **Team Management**: Role based access control and team management functionalities.
- **Marketplace**: (Future) Publish and copy examples and integrations of platform components.
- **Custom Domain Mapping**: Provide custom subdomains or vanity domains for user-created components.
- **Hosting**: User-generated content hosted on the platform.

## Technology Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, PostgreSQL, Prisma ORM
- **Testing**: Jest for unit and integration tests
- **Code Execution**: Isolated-vm, es-build
- **CI/CD**: GitHub, Vercel

## Installation

To install and run the platform locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/autoflow.git
   cd autoflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables as per `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Usage

1. **Creating Workflows**: Use the node-based editor to visually design workflows. Each node represents a specific action, and edges represent data flow.
2. **Custom Scripts**: Write custom scripts in JavaScript or TypeScript to extend the functionality of predefined nodes.
3. **Chatbot Customization**: Design chatbot interfaces with the integrated development environment, configuring both appearance and functionality.
4. **Publishing Components**: (Future) Share workflows, chatbots, and scripts on the marketplace for others to use.

## Future Work

- **Marketplace Development**: Implement a feature for publishing and sharing platform components to other users.
- **Enhanced Chatbot Configurations**: Complete implementation for more extensive customization options.
- **Workflow Integration with Chatbots**: Enable more complex interactions within chatbots.
- **Node Editor Expansion**: Add more node types such as AI, condition, and network nodes.
- **Comprehensive Documentation**: Create detailed user manuals, tutorials, and sample projects.
- **Code Execution Enhancements**: Explore WebAssembly for supporting multiple programming languages and enhance scalability.
- **Analytics**: Provide insights into component performance and usage.
- **React Component Integration**: Allow generation of React components to enhance chatbot interactions.
