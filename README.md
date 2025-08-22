# 🚨 SOS Notification Microservices

A modern microservices-based emergency alert system for sending SOS notifications to trusted contacts.

## 📋 Overview

SOS Notification Microservices is a backend application designed to help users notify their trusted contacts in emergency situations. The system enables users to:

- 🔔 Send SOS alerts to pre-registered trusted contacts
- 👥 Manage trusted contacts for emergency notifications
- 📱 Deliver notifications through multiple channels (email, SMS)
- 🔄 Track and resolve emergency situations

This project demonstrates modern microservices architecture, event-driven design, and real-time notification capabilities using industry-standard technologies.

## 🏗️ Architecture

The system is built using a microservices architecture with the following components:

> **Note:** This project is under active development. New features and improvements are continuously being added.

### Core Services

- **🔑 Auth Service**: Handles user authentication and authorization
- **👤 User Service**: Manages user profiles and trusted contact relationships
- **🆘 SOS Service**: Processes emergency requests and coordinates notifications
- **📲 Notification Service**: Delivers alerts through multiple channels
- **🌐 API Gateway**: Provides a unified entry point for client applications (planned)

## 🛠️ Tech Stack

### Backend

- **TypeScript** - Statically typed JavaScript
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **gRPC** - High-performance RPC framework

### Databases

- **PostgreSQL** - Relational database for structured data
- **MongoDB** - NoSQL database for document storage
- **Redis** - In-memory data store for caching

### Messaging

- **RabbitMQ** - Message broker for distributed systems

### DevOps & Infrastructure

- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration
- **Elasticsearch** - Search and analytics engine
- **Kibana** - Data visualization dashboard
- **Logstash** - Data processing pipeline

### Development Tools

- **Prisma** - Next-generation ORM for TypeScript and Node.js
- **ESLint** - Static code analysis tool
- **Prettier** - Code formatter

## 🔍 Features

### Current Features

- ✅ User authentication and authorization
- ✅ User account management
- ✅ Trusted contact relationships
- ✅ Basic notification framework
- ✅ Service communication via gRPC
- ✅ Event-driven architecture with RabbitMQ
- ✅ Centralized logging with ELK stack

### Planned Features

- 🔜 API Gateway
- 🔜 Complete SOS request lifecycle management
- 🔜 Real-time status updates
- 🔜 Analytics and reporting

## 💻 API Documentation

### gRPC Services

The system uses gRPC for service-to-service communication. Proto definitions are available in the `services/shared/proto` directory:

- `auth_service.proto`: Authentication service definitions
- `user_service.proto`: User management service definitions
- `notification_service.proto`: Notification service definitions
- `sos_service.proto`: SOS request management service definitions

### REST API (Planned)

REST API documentation will be available when the API Gateway service is completed.

## 📊 Project Structure

```text
sos-notification-microservice/
├── docker-compose.yml          # Main Docker Compose configuration
├── elk-stack/                  # Elasticsearch, Logstash, Kibana config
├── services/                   # Microservices
│   ├── auth-service/           # Authentication service
│   ├── notification-service/   # Notification service
│   ├── shared/                 # Shared libraries and proto definitions
│   ├── sos-service/            # SOS management service
│   └── user-service/           # User management service
└── volumes/                    # Persistent data volumes
```

## 🛠️ Project Status

This project is currently in active development, with approximately 55-60% of the planned features implemented. Key components that are fully functional include:

- ✅ Authentication and authorization
- ✅ User and contact management
- ✅ Basic notification infrastructure
- ✅ Service communication via gRPC
- ✅ Database integrations

Features under development:

- 🔄 SOS Service implementation
- 🔄 Enhanced notification capabilities
- 🔄 API Gateway integration

This project will continue to evolve with new features, optimizations, and improvements over time.

### 🙏 Acknowledgements

- This project was created as a learning exercise and portfolio showcase
- Inspired by real-world emergency alert systems
- Built with modern microservices best practices

---

⭐ **Like this project? Give it a star on GitHub!** ⭐
