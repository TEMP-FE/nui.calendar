import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MonthlyCalendar from "./components/MonthlyCalendar";

function App() {
    return (
        <div className="App">
            <MonthlyCalendar />
            <MonthlyCalendar year={2020} month={10} />
        </div>
    );
}

export default App;
