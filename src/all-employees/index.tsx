import React from "react";
import { Button } from '@vostokplatform/uikit';
import { IEmployee } from "../app/App";
import { EmployeeList } from "../common/EmployeeList";
import styles from './AllEmployees.module.css';
import commonStyles from '../common/Common.module.css';

interface IProps {
  employees: IEmployee[];
  showSaveForm: (index: number | null) => () => void;
  showVisits: (index: number | null) => () => void;
}

export default function AllEmployeesPage(props: IProps) {
  return (
    <div className={styles.AllEmployeesPage}>
      <div className={commonStyles.pageTitle}>
        Все сотрудники
      </div>
      <Button onClick={props.showSaveForm(null)}>Новый сотрудник</Button>
      <EmployeeList onEmployeeClick={props.showVisits} employees={props.employees} />
    </div>
  )
}
