import { useActions } from "../hooks";
import Button from "./button";
import "./action-bar.css";

type ActionBarProps = {
  id: string;
};

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();
  return (
    <div className="action-bar">
      <Button iconClass="fa-arrow-up" onClick={() => moveCell(id, "up")} />
      <Button iconClass="fa-arrow-down" onClick={() => moveCell(id, "down")} />
      <Button iconClass="fa-trash" onClick={() => deleteCell(id)} />
    </div>
  );
};

export default ActionBar;
