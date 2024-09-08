---
sidebar_position: 3
title: Concepts
description: Learn about the core concepts of Bolt
---

# Bolt

Bolt is a framework for building typed REST APIs in NodeJS.

It provides a simple, modular, and type-safe way to define routes, handle requests, and interact with clients.

The framework is _fully_ modular, meaning that you could define the following each in a separate package:

- Route definitions
- Server handlers
- Servers
- Clients

# Terminology

- **Route**: A route is a single endpoint in your API.
- **Handler**: A handler is the function attached to your server, handling a specific route's requests.
- **Schema**: Schemas are used to validate, serialize, and type resources with bolt. We currently support Zod, but other similar libraries should work as well.