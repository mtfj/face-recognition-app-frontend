import React, { Fragment } from "react";
import { IVisit } from "../app/App";
import commonStyles from '../common/Common.module.css';
import { prepareBase64 } from "../utils";
import styles from './EmployeesByDay.module.css';

interface IProps {
  visits: IVisit;
}

export const Visits = (props: IProps) => {
  return (
    <div className={styles.Visits}>
      {props.visits.ts.map((visitTs, i) => {
        let visitTime = new Date(visitTs * 1000);
        visitTime.setHours(visitTime.getHours() - 3);
        const employee = {...props.visits, photo: prepareBase64(props.visits.mark_photos[i])};
        return (
          <Fragment key={visitTs}>
            <div className={styles.visit}>
              <div key={employee.name}>
                <img src={employee.photo} alt={employee.name} className={styles.employeeAvatar} />
              </div>
              <div className={styles.visitTime}>
                <div>Время прибытия</div>
                <div className={commonStyles.bigText}>{visitTime.toLocaleString().split(',')[1]}</div>
              </div>
            </div>
            <div className={commonStyles.divider} />
          </Fragment>
        );
      })}
    </div>
  )
};
