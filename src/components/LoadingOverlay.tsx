import Spinner from "./Spinner";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center Z-50 h-screen">
      <div className="loader"></div>{" "}
      <Spinner />
    </div>
  );
};

export default LoadingOverlay;
