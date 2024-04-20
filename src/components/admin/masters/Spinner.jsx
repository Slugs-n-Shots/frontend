const Spinner = ({ shown }) => {
  return (
      <div id="overlay" className={shown ? "visible" : ""}>
        <div className="spinner">{shown}</div>
      </div>
  );
};

export default Spinner;
