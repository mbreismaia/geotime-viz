# Spatiotemporal Data Visualization Dashboard

This project provides an interactive dashboard for visualizing spatiotemporal data using dimensionality reduction techniques like T-SNE and UMAP. The current dataset used is from NYC Taxi and Limousine Commission (NYC TLC), providing insights into taxi rides in New York City. This tool helps in exploring data patterns over time and space in a user-friendly interface.

## Project Structure

The project is divided into two main components:

- **Backend**: Built with FastAPI and Python, responsible for processing the data and providing an API for the frontend.
- **Frontend**: Developed using Next.js and TypeScript, offering a visually rich interface for users to interact with the data.

Both parts communicate with each other via Axios, which ensures smooth data flow between the backend and frontend.

## Requirements

### Backend
The backend uses Python and FastAPI. Dependencies are listed in the `requirements.txt` file.

### Frontend
The frontend is built using Next.js and TypeScript, so you need to have Node.js installed.

## Getting Started

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd backend

2. **Set up a virtual environment (optional but recommended)**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`

3. **Install dependencies**:
   ```bash
    pip install -r requirements.txt`

4. **Run the FastAPI server:**:
   ```bash
    uvicorn main:app --reload`
   
This will start the backend server, and it will be available at http://127.0.0.1:8000.

### Frontend Setup

1. **Open a new terminal window** to set up and run the frontend.

2. **follow the commands below**:
   ```bash
   cd frontend
   npm install
   npm run dev`

This will start the frontend development server, and it will be available at http://localhost:3000.

Now you can open your browser and access the dashboard at http://localhost:3000. The frontend will fetch data from the backend, and you will be able to explore the interactive spatiotemporal data visualizations.
