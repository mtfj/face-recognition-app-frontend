import React from "react";
import App, { IEmployee } from "../app/App";
import { EmployeeList } from "../common/EmployeeList";
import styles from './EmployeesByDay.module.css';

interface IProps {
  employees: IEmployee[];
  showVisits: (index: number | null) => () => void;
}

export default function EmployeesByDayPage(props: IProps) {
  return (
    <div className={styles.EmployeesByDay}>
      <div className={styles.pageTitle}>
        идентифицированные сотрудники, последние сутки
      </div>
      <EmployeeList onEmployeeClick={props.showVisits} employees={props.employees} />
    </div>
  )
}
