import Spinner from "./Spinner";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="loader"></div>{" "}
      <Spinner />
    </div>
  );
};

export default LoadingOverlay;
