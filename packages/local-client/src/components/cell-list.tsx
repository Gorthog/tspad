import { Fragment, useEffect } from "react";
import { useAppSelector } from "../hooks/hooks";
import CellListItem from "./cell-list-item";
import AddCell from "./add-cell";
import { useActions } from "../hooks";
import "./cell-list.css";

const CellList: React.FC = () => {
  const { fetchCells } = useActions();

  const cells = useAppSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  );

  useEffect(() => {
    fetchCells();
  }, []);

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell previousCellId={null} forceVisible={renderedCells.length == 0} />
      {renderedCells}
    </div>
  );
};

export default CellList;
