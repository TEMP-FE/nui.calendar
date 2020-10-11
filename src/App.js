import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MonthlyCalendar from "./components/MonthlyCalendar";

function App() {
    return (
        <div className="App" style={{ padding: "50px" }}>
            <MonthlyCalendar />
            <MonthlyCalendar year={2020} month={10} />
            <MonthlyCalendar year={2020} month={11} />
            <MonthlyCalendar year={2021} month={0} />
        </div>
    );
}

export default App;
