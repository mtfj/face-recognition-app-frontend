import React from "react";
import App, { IEmployee } from "../app/App";
import styles from './Common.module.css';
import Employee from "./Employee";

interface IProps {
  employees: IEmployee[];
  onEmployeeClick: (index: number | null) => () => void;
}

export const EmployeeList = ({ employees, onEmployeeClick }: IProps) => {
  return (
    <div className={styles.EmployeeList}>
      <div className={styles.bigText}>
        Всего {employees.length}
      </div>
      <div className={styles.itemList}>
        {employees.map((e, i) =>
          <Employee key={e.name} employee={e} showVisits={onEmployeeClick(i)} />
        )}
      </div>
    </div>
  );
};
