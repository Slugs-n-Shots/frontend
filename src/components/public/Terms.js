import config from "models/config";

export default function Terms(){

    return (
      <div className="container mt-5">
        <h2>Terms of use</h2>
        <p>&nbsp;</p>
        <footer className="mt-5">
          <p>&copy; 2024 {config.appName} Project</p>
        </footer>
      </div>
    );
  }
