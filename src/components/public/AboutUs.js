import config from "models/config";

export default function AboutUs(){

  return (
    <div className="container mt-5">
      <h2>About Us</h2>
      <p>
        Project GitHub: <a href="https://github.com/slugs-n-shots/">Slugs'n'Shots</a>
      </p>

      {/* You can add additional styling or Bootstrap classes for the footer */}
      <footer className="mt-5">
        <p>&copy;2024 {config.appName} project</p>
      </footer>
    </div>
  );
}
