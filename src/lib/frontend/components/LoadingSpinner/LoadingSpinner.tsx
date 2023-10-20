import { ClipLoader } from "react-spinners";

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-row justify-center">
    <ClipLoader color="#3b82f6" size={100} />
  </div>
);

export { LoadingSpinner };
