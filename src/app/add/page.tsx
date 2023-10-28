import { savePlace } from "@/lib/backend/place/place";
import { AddExceptionalThing } from "@/lib/frontend/components/AddExceptionalThing/AddExceptionalThing";

const AddPage: React.FC = () => <AddExceptionalThing savePlace={savePlace} />;

export default AddPage;
