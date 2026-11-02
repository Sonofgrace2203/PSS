# Physics Simulation Studio (PSS)

**An interactive platform for exploring, running, and understanding physics simulations.**

Physics Simulation Studio (PSS) is a web-based educational platform designed to make physics simulations more accessible, interactive, and practical. It provides users with a digital environment to explore physical phenomena, adjust simulation parameters, observe results, and develop a deeper understanding of physics concepts.

PSS combines interactive visualisation with simulation management tools to support students, educators, and anyone interested in computational physics.

---

## Features

### Interactive Physics Simulations
- Run physics simulations using adjustable parameters.
- Visualise simulation results through interactive graphical representations.
- Observe how changes in physical parameters affect simulation outcomes.
- Reset and run simulations with new configurations.

### Simulation Management
- User authentication and account management.
- Save simulation results for future reference.
- Access previously saved simulations.
- Add notes and descriptions to simulation results.
- Manage saved simulation records.

### Export and Reporting
- Export simulation results for documentation and further analysis.
- Generate downloadable reports in supported formats.

### Application Settings
- Personalise general application settings.
- Configure shared simulation settings and limits.
- Manage application preferences.

### Demo Environment
- Explore selected simulations without needing to create or save a personal simulation record.

---

## Technology Stack

PSS is built using modern web technologies:

| Component | Technology |
|---|---|
| Frontend | Blazor WebAssembly |
| Backend | ASP.NET Core Minimal APIs |
| Programming Language | C# |
| Framework | .NET 10 |
| Database | PostgreSQL |
| Database Hosting | Supabase |
| Authentication | ASP.NET Core Identity and JWT |
| Visualisation | Interactive simulation charts and graphics |
| Version Control | Git and GitHub |

---

## Architecture

PSS uses a client-server architecture.

```text
                  PHYSICS SIMULATION STUDIO
                            |
              +-------------+-------------+
              |                           |
        Blazor WebAssembly           ASP.NET Core API
             Client                    (pssapi)
              |                           |
              |        HTTP Requests      |
              +-------------------------->|
                                          |
                                    Application Logic
                                          |
                                    PostgreSQL Database
                                          |
                                        Supabase
```

The frontend handles the user interface and simulation interactions, while the backend manages API operations, authentication, application settings, and persistent data.

---

## Getting Started

### Prerequisites

To run PSS locally, you will need:

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- Visual Studio Code or another compatible .NET IDE.
- PostgreSQL database or a configured Supabase project.
- Git.

### Installation

**1. Clone the frontend repository**

```bash
git clone https://github.com/Sonofgrace2203/PSS.git
```

**2. Navigate into the project**

```bash
cd PSS
```

**3. Restore dependencies**

```bash
dotnet restore
```

**4. Run the application**

```bash
dotnet run
```

> The backend API (`pssapi`) must also be configured and running for features that require server communication.

### Backend Setup

The backend is maintained separately in the `pssapi` repository.

Configure the required database connection and authentication settings before running the API. Keep sensitive credentials in local configuration or environment variables; never commit production secrets to GitHub.

---

## Project Structure

The project is organised into separate client and server applications:

```text
PSS/
│
├── Components/
│   ├── Pages/
│   ├── Layout/
│   └── Shared/
│
├── Services/
├── Models/
├── wwwroot/
├── Program.cs
└── PSS.csproj
```

The backend API is maintained in a separate repository:

**PSS API:** `pssapi`

---

## Project Vision

The long-term vision of Physics Simulation Studio is to provide a growing collection of interactive physics simulations that help bridge the gap between theoretical concepts and practical understanding.

PSS aims to make computational physics more approachable by combining simulation, visualisation, experimentation, and result management in one platform.

---

## Development Status

PSS is actively under development. Features and improvements are being introduced progressively as the platform evolves.

---

## Author

**Mustapha Olabode**

Software Developer | Physics Graduate | Computational Science Enthusiast

- GitHub: [@Sonofgrace2203](https://github.com/Sonofgrace2203)
- LinkedIn: [Mustapha Olabode](https://www.linkedin.com/in/mustapha-olabode-074224162/)

---

## License

The licensing terms for this project will be specified in a future release.