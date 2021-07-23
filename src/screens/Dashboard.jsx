import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Siderbar";
import Users from "../components/Users";
import FunCounter from "../components/FunCounter";
import FunCities from "../components/FunCities";
import "./dashboard.css";
import Products from "../components/Products";
import Transaction from "../components/Transaction";
import Categories from "../components/Categories";
import Orders from "../components/Orders";
import UserForm from "../components/UserForm";

function Dashboard(props) {
	return (
		<div class="m-dashboard">
			<div className="d-top-nav">
				<Header />
			</div>
			<div className="content-wrap">
				<div className="d-sidebar">
					<Sidebar />
				</div>
				<div className="d-main">
					<Switch>
						<Route
							path={`${props.match.path}/users/new`}
							component={UserForm}
						/>
						<Route path={`${props.match.path}/users`} component={Users} />
						<Route path={`${props.match.path}/products`} component={Products} />
						<Route
							path={`${props.match.path}/transactions`}
							component={Transaction}
						/>
						<Route
							path={`${props.match.path}/categories`}
							component={Categories}
						/>
						<Route path={`${props.match.path}/orders`} component={Orders} />
					</Switch>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;