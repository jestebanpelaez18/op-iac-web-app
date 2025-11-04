
# OP Kiitorata – Infrastructure as Code 
**Author:** Juan Esteban Pelaez Hoyos  

This project implements the Cloud/IaC assignment using **AWS CDK (TypeScript)**. It deploys a simple web application with a **static frontend** hosted on Amazon S3 and a **serverless backend** (AWS Lambda + API Gateway). Everything is fully defined as code and can be deployed in a few simple steps.

---

## 1. Problem interpretation
The goal was to demonstrate the use of **Infrastructure as Code (IaC)** to deploy a small but complete cloud-based web application.  
The main objectives were:
- Define all infrastructure through code (no manual AWS Console steps).  
- Make deployment reproducible, quick, and easy to clean up.  
- Combine multiple AWS services (S3, Lambda, API Gateway) in a coherent application.

---

## 2. Approach
- **Infrastructure as Code:** Implemented with AWS CDK v2 using TypeScript.  
- **Frontend:** A static web page (`index.html`) hosted on an S3 bucket configured for website hosting.  
- **Backend:** A Node.js Lambda function responding to `GET /` and `GET /hello` requests through API Gateway.  
- **Integration:** During deployment, CDK creates a small `config.js` file with the API URL, which the frontend loads dynamically.

---

## 3. Repository Structure 

| Directory/File | Description |
| :--- | :--- |
| `infra/` | **AWS CDK** app (S3, Lambda, API Gateway) |
| `backend/` | **Lambda** function (written in **TypeScript**) |
| `frontend/` | **Static** web app (HTML + JS) |
| `Makefile` | Simple automation for setup and deployment |
| `README.md` | This document |

---

## 4. Prerequisites 

Before starting, please ensure you have the following installed and configured:

* **Node.js** (v18 or newer)
* **AWS CLI** installed and configured with valid credentials:
    ```bash
    aws configure
    ```
* An **AWS account** with permissions to deploy **S3**, **Lambda**, and **API Gateway**.
* **(Optional)** **make** installed for one-command setup (included by default on macOS/Linux).

---

## 5. Setup and Installation 

### Option A — Using `make` (Recommended)

This is the easiest way to install everything and deploy the stack.

| Step | Command | Description |
| :--- | :--- | :--- |
| **1. Install Dependencies** | `make setup` | Installs dependencies in `infra/` and `backend/`. |
| **2. Bootstrap AWS CDK** | `make bootstrap` | Initializes CDK environment (only once per account/region). |
| **3. Deploy the App** | `make deploy` | Builds and deploys the full stack (S3, Lambda, API Gateway). |

---

### Option B — Manual Commands (If `make` is not available)

1.  **Install dependencies in subdirectories:**
    ```bash
    cd infra && npm install
    cd ../backend && npm install
    ```
2.  **Bootstrap CDK** (only once per AWS account/region):
    ```bash
    cd ../infra
    npx cdk bootstrap
    ```
3.  **Deploy infrastructure:**
    ```bash
    npm run build || true
    npx cdk deploy
    ```

### Post-Deployment 

After deployment, you'll see outputs similar to this:

-InfraStack.ApiUrl = https://xxxx.execute-api.eu-north-1.amazonaws.com/prod/
-InfraStack.WebAppBucketOutputURL = http://infrastack-webappbucket-xxxx.s3-website.eu-north-1.amazonaws.com

**Copy and open the `InfraStack.WebAppBucketOutputURL` in your browser.** You'll see a simple static page that successfully fetches and displays a live response from the backend API.

---

## 6. How It Works 

Here is a brief overview of the architecture and flow:

* **S3 Bucket** hosts the **static website** and serves the `index.html` file.
* **Lambda Function** runs a lightweight **backend** that returns JSON data.
* **API Gateway** exposes the Lambda function through two `GET` endpoints (`/` and `/hello`).
* **CDK Deployment** automatically uploads the frontend files to S3 and injects the **API URL** into a `config.js` file for the frontend to use.
* The **frontend** fetches data from the backend API endpoints and displays it on the page.

In short:  
You open the website → it loads from S3 → calls the API → and shows the backend’s response live.

---

## 7. Deploy and Destroy 

### Deploy the Application

You can deploy the full stack using either the `make` command (recommended) or the manual CDK command:

**Using `make`:**
```bash
make deploy
```

**Manual CDK Command:**
```bash
cd infra && npx cdk deploy
```

### Destroy the Application

To completely remove all resources (S3 bucket, Lambda function, API Gateway, etc.) created by this project from your AWS account, use one of the following commands:

**Using `make`:**
```bash
make destroy
```

**Manual CDK Command:**
```bash
cd infra && npx cdk destroy
```

## 8. Testing 

You can verify the successful deployment of the frontend and backend in two ways:

1.  **Test the Full Stack (Frontend + Backend):**
    * Open the **S3 Website URL** (`InfraStack.WebAppBucketOutputURL`) from the deployment output in your browser.
    * You should see a title (e.g., "**Hello OP 👋**") and a section that successfully loads and displays the **JSON response** fetched from the backend API.

2.  **Test the API Directly (Backend Only):**
    * Use `curl` to call the API Gateway endpoint (`InfraStack.ApiUrl`):

    ```bash
    curl "<ApiUrl>/hello"
    ```

    * **Expected output** (the time will vary):

    ```json
    {
      "message": "Hello OP, from the backend",
      "path": "/hello",
      "time": "2025-11-01T10:00:00.000Z"
    }
    ```
## 9. Assumptions and Trade-offs 

This project makes the following assumptions and design trade-offs for simplicity and demonstration purposes:

* **Public S3 Bucket:** The bucket is set to **public** for demonstration only, which makes testing easier.
    > ⚠️ **Note:** In a production environment, the S3 bucket should be placed behind **CloudFront** with proper origin access control (OAC) to restrict direct public access.
* **Easy Cleanup:** `RemovalPolicy.DESTROY` and `autoDeleteObjects: true` are used to ensure the entire stack cleans up easily without manual intervention when running `cdk destroy`.
* **CORS:** Cross-Origin Resource Sharing (**CORS**) is enabled for **all origins** (`*`) to simplify frontend-backend communication.
* **Focus:** The project focuses primarily on **infrastructure quality and clarity** (CDK, Lambda, API Gateway integration), not sophisticated frontend design.

## 10. Missing Parts or Non-Idealities 🚧

The current implementation has a few missing features or non-ideal aspects that are out of the scope of this initial demonstration:

* **No authentication or persistent storage:** These features (e.g., database integration, user sign-in) were **out of scope** for this project.
* **No HTTPS for the static website:** Enabling HTTPS would require setting up a custom domain and integrating **CloudFront** (which was avoided for deployment speed and simplicity).
* **Minimal error handling and no automated tests:** The focus was on infrastructure deployment. Functionality was verified through **manual testing** (as outlined in Section 8).