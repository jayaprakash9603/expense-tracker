import React from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TotalRow from "./TotalRow";
import { formatDate } from "./dateUtils";

const FilteredTable = ({ filteredData, onDelete }) => {
  return (
    <div className="table-responsive">
      {Object.keys(filteredData).length > 0 ? (
        Object.keys(filteredData).map((date) => (
          <div key={date} className="mb-4">
            <h3 className="text-center">{formatDate(date)}</h3>
            <table className="table table-striped table-bordered">
              <TableHeader date={date} />
              <tbody>
                <TableBody
                  data={filteredData[date]}
                  date={date}
                  onDelete={onDelete}
                />
                <TotalRow data={filteredData[date]} />
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <div className="alert alert-info text-center">No data found.</div>
      )}
    </div>
  );
};

export default FilteredTable;
