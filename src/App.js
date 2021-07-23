import logo from "./logo.svg";
import "./App.css";
import Heading from "./components/Heading";
import Person from "./components/Person";
import Cities from "./components/Cities";

import Counter from "./components/Counter";
import Counters from "./components/Counters";
import FunCounter from "./components/FunCounter";
import FunCities from "./components/FunCities";
import Title from "./components/Title";
import Users from "./components/Users";
import UserForm from "./components/UserForm";
import { Redirect, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import User from "./components/User";
import Dashboard from "./screens/Dashboard";
import Login from "./screens/LoginPanel";
import LoginPanel from "./screens/LoginPanel";

function App() {
	return (
		<div>
			<Switch>
				<Route
					path="/counter"
					render={(props) => <Counter name="ankush" {...props} />}
				/>
				<Route path="/cities" component={Cities} />
				<Route path="/login" component={LoginPanel} />
				<Route path="/dashboard" component={Dashboard} />
				<Route path="/users/new" component={UserForm} />
				<Route path="/user/:id?" component={User} />
				<Route path="/users" component={Users} />
				<Route path="/home" component={Home} />
				<Route path="/404" component={NotFound} />
				<Redirect from="/" to="/404" />
			</Switch>
		</div>
	);
}

export default App;