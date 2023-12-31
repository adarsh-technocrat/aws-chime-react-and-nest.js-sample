# AWS Chime React and Nest.js Sample

This repository provides a comprehensive sample application demonstrating the integration of Amazon Chime SDK with a React frontend and Nest.js backend. Amazon Chime is a secure, real-time communication service that makes it easy to add audio, video, and chat features to your applications.

## Backend Controllers

### AppController

The `AppController` in the Nest.js backend handles various meeting-related operations through different endpoints.

#### 1. Join Meeting Endpoint:

- **Path:** `/meeting/joinMetting`
- **Method:** `GET`
- **DTO (Data Transfer Object):** `JoinMeetingDTO`
- **Description:** Handles a GET request to join a meeting. It captures data from the query parameters using the `JoinMeetingDTO` and delegates the operation to the `joinMeeting` method in the `AppService`.

#### 2. Generate Meeting Link Endpoint:

- **Path:** `/meeting/generate-meeting-link`
- **Method:** `GET`
- **Description:** Handles a GET request to generate a meeting link. Delegates the operation to the `generateMeetingLik` method in the `AppService`.

#### 3. Delete Attendee Endpoint:

- **Path:** `/meeting/delete-attendee`
- **Method:** `DELETE`
- **DTO:** `DeleteAttendeeDto`
- **Description:** Handles a DELETE request to delete an attendee from a meeting. It captures data from the query parameters using the `DeleteAttendeeDto` and delegates the operation to the `deleteAttendee` method in the `AppService`.

#### 4. Delete Meeting Endpoint:

- **Path:** `/meeting/delete-meeting`
- **Method:** `DELETE`
- **DTO:** `DeleteMeetingDto`
- **Description:** Handles a DELETE request to delete a meeting. It captures data from the query parameters using the `DeleteMeetingDto` and delegates the operation to the `deleteMeeting` method in the `AppService`.

## Getting Started

Follow the step-by-step instructions in the [**Getting Started Guide**](./docs/getting-started.md) to set up and run the application locally. This guide includes prerequisites, installation steps, and configuration details.

## Documentation

Refer to the [**Documentation folder**](./docs) for in-depth information on different aspects of the application, including architecture, configuration, and customization.

## Contributions

We welcome contributions from the community! Whether it's bug fixes, feature enhancements, or documentation improvements, your contributions make this project better. Please review our [**Contribution Guidelines**](./CONTRIBUTING.md) before getting started.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Feedback

If you have any questions, suggestions, or issues, feel free to open an [**issue**](../../issues). We appreciate your feedback!
