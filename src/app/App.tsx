import { Tabs, SidePanel, Form, Input, Button } from "@vostokplatform/uikit";
import spriteSvgPublicPath from '@vostokplatform/uikit/sprite.svg';
import '@vostokplatform/uikit/styles.css';
import React, { Component, createRef, Fragment } from 'react';
import AllEmployeesPage from "../all-employees";
import EmployeesByDayPage from "../employees-by-day";
import { Visits } from "../employees-by-day/Visits";
import FaceDetection from "../face-detection/FaceDetection";
import vostokLogo from '../icons/vostok-logo.svg';
import Now from "../now";
import { prepareBase64 } from "../utils";
import styles from './App.module.css';
import { BASE_URL } from "./constants";
import handleBase64 from "../utils/handle-base64";

export interface IVisit extends IEmployee {
  mark_photos: string[];
  ts: number[];
}

export interface IEmployee {
  details: string;
  name: string;
  photo: string;
}

interface IState {
  spriteSvg: string;
  employeesByDay: IVisit[];
  allEmployees: IVisit[];
  visitsIsVisible: boolean;
  saveFormIsVisible: boolean;
  currentEmployeeIndex: number | null;
  saveForm: {
    photo: string,
    name: string,
    description: string,
  };
  isFullScreenMode: boolean;
  currentTab: string;
}

interface IProps {
}

class App extends Component<IProps, IState> {
  state = {
    spriteSvg: '',
    employeesByDay: [],
    allEmployees: [],
    visitsIsVisible: false,
    saveFormIsVisible: false,
    currentEmployeeIndex: null,
    saveForm: {
      photo: '',
      name: '',
      description: '',
    },
    isFullScreenMode: false,
    currentTab: '2',
  };

  imgRef = createRef<HTMLInputElement>();

  async componentDidMount() {
    const response = await fetch(spriteSvgPublicPath);
    const spriteSvg = await response.text();
    this.setState({spriteSvg});

    setInterval(() => {
      this.getAllEmployees();
      this.getEmployyeesByDay();
    }, 15000);
  }

  get now() {
    const date = new Date();
    const year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    let dt: string | number = date.getDate();
    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    return year + '-' + month + '-' + dt;
  };

  getAllEmployees = async () => {
    const response = await fetch(`${BASE_URL}/all_employees`);
    // const response = await fetch(`/mocks/all_employees.json`);
    const responseJson = await response.json() as unknown as IVisit[];
    responseJson.map(e => {
      e.photo = prepareBase64(e.photo);
      return e;
    });

    const dataByAllEmployees = await this.getDataByAllEmployees();
    const allEmployees = responseJson.map((employee: IVisit) => {
      employee.ts = [];
      employee.mark_photos = [];
      for (let data of dataByAllEmployees) {
        if (data.name === employee.name) {
          employee.ts = data.ts;
          employee.mark_photos = data.mark_photos;
        }
      }
      return employee;
    });

    this.setState({allEmployees})
  };

  getEmployyeesByDay = async () => {
    const response = await fetch(`${BASE_URL}/employees_by_day?date=${this.now}`);
    // const response = await fetch(`/mocks/employees_by_day.json`);
    const responseJson = await response.json() as unknown as IVisit[];
    responseJson.map(e => {
      e.photo = prepareBase64(e.photo);
      e.mark_photos.map(photo => prepareBase64(photo));
      return e;
    });
    this.setState({employeesByDay: responseJson})
  };

  getDataByAllEmployees = async (): Promise<IVisit[]> => {
    const response = await fetch(`${BASE_URL}/data_by_all_employees`);
    return response.json() as unknown as IVisit[];
  };

  showVisits = (index: number | null) => () => {
    this.setState({visitsIsVisible: true, currentEmployeeIndex: index})
  };

  hideVisits = () => {
    this.setState({visitsIsVisible: false, currentEmployeeIndex: null})
  };

  showSaveForm = (index: number | null) => () => {
    this.setState({saveFormIsVisible: true})
  };

  hideSaveForm = () => {
    this.setState({saveFormIsVisible: false})
  };

  onTabChange = (key: string) => {
    if (key === '1') {
      this.getEmployyeesByDay();
    }
    if (key === '3') {
      this.getAllEmployees();
    }
    this.setState({currentTab: key})
  };

  createEmployee = async () => {
    const {photo, name, description} = this.state.saveForm;
    const r = await fetch(`${BASE_URL}/add_employee`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({photo, name, description})
    });
    this.getAllEmployees();
  };

  handleInput = (inputName: string) => (value: string) => {
    this.setState(prevState => ({
      saveForm: {
        ...prevState.saveForm,
        [inputName]: value,
      }
    }));
  };

  getBase64 = (e: any) => {
    const img = this.imgRef.current;
    if (img === null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      let result = reader.result as string;
      this.setState(prevState => ({
        saveForm: {
          ...prevState.saveForm,
          photo: handleBase64(result)
        }
      }));
    };
  };

  switchFullScreenMode = () => {
    this.setState((prevState) => ({ isFullScreenMode: !prevState.isFullScreenMode }))
  };

  render() {
    const {
      spriteSvg,
      employeesByDay,
      allEmployees,
      visitsIsVisible,
      saveFormIsVisible,
      currentEmployeeIndex,
      isFullScreenMode,
      currentTab
    } = this.state;
    let currentEmployee!: IVisit;
    if (currentEmployeeIndex === null) {
      currentEmployee = {
        photo: '',
        name: '',
        details: '',
        mark_photos: [],
        ts: []
      }
    } else if (currentTab === '1') {
      currentEmployee = employeesByDay[currentEmployeeIndex];
    } else if (currentTab === '3') {
      currentEmployee = allEmployees[currentEmployeeIndex];
    }

    return (
      <div className={styles.App} style={{
        padding: isFullScreenMode ? '0' : '60px 60px 0 60px',
        backgroundColor: isFullScreenMode ? 'black' : "transparent"
      }}>
        <div dangerouslySetInnerHTML={{__html: spriteSvg}} className={styles.svgSprite}/>
        {isFullScreenMode ? <FaceDetection isFullScreenMode={isFullScreenMode} /> : (
          <Fragment>
            <div className={styles.layout}>
              <div className={styles.layoutLeftSide}>
                <img src={vostokLogo} className={styles.logo} alt="vostok logo"/>
                <div className={styles.pageContent}>
                  <Tabs defaultActiveKey={currentTab} onChange={this.onTabChange}>
                    <Tabs.Pane tab="Данные" key="1">
                      <EmployeesByDayPage showVisits={this.showVisits} employees={employeesByDay}/>
                    </Tabs.Pane>
                    <Tabs.Pane tab="Камера" key="2">
                      <FaceDetection isFullScreenMode={isFullScreenMode}/>
                    </Tabs.Pane>
                    <Tabs.Pane tab="Сотрудники" key="3">
                      <AllEmployeesPage showVisits={this.showVisits} employees={allEmployees}
                                        showSaveForm={this.showSaveForm}/>
                    </Tabs.Pane>
                  </Tabs>
                </div>
              </div>
              <Now/>
            </div>
            <SidePanel
              visible={visitsIsVisible}
              mainTitle={currentEmployeeIndex === null ? '' : currentEmployee.name}
              subTitle={currentEmployee.details}
              theme={'black'}
              onCancel={this.hideVisits}
            >
              {currentEmployeeIndex !== null && <Visits visits={currentEmployee}/>}
            </SidePanel>
            <SidePanel
              visible={saveFormIsVisible}
              mainTitle={'Добавить нового сотрудника'}
              subTitle={''}
              theme={'black'}
              onCancel={this.hideSaveForm}
            >
              <Form className={styles.Form}>
                <div className={styles.formActions}>
                  <Form.Item><Button type="primary" className={styles.formSubmitButton}
                                     onClick={this.createEmployee}>Добавить</Button></Form.Item>
                  <Form.Item><Button>Отмена</Button></Form.Item>
                </div>
                <Form.Item>
                  <Input placeholder="Имя" onChange={this.handleInput('name')}/>
                </Form.Item>
                <Form.Item>
                  <Input placeholder="Описание" onChange={this.handleInput('description')}/>
                </Form.Item>
                <Form.Item>
                  <input placeholder="" type="file" onChange={this.getBase64} ref={this.imgRef}/>
                </Form.Item>
              </Form>
            </SidePanel>
          </Fragment>
        )}
        {currentTab === '2' && (
          <Button
            onClick={this.switchFullScreenMode}
            className={styles.fullScreenModeButton}
          >{
              isFullScreenMode ? 'exit' : 'full screen mode'}
          </Button>
        )}
      </div>
    );
  }
}

export default App;
