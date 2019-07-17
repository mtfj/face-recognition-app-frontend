import React, { Fragment } from "react";
import App, { IEmployee } from "../app/App";
import styles from "./Common.module.css";

interface IProps {
  employee: IEmployee;
  showVisits?(): void;
}

export default ({ employee, showVisits }: IProps) => (
  <div className={styles.employee} key={employee.name} onClick={showVisits}>
    <img src={employee.photo} alt={employee.name} className={styles.employeeAvatar} />
    <div className={styles.employeeName}>
      {employee.name}
    </div>
    <div className={styles.employeeDescription}>
      {employee.details}
    </div>
  </div>
)
