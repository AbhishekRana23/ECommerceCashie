import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Siderbar";
import Users from "../components/Users";
import FunCounter from "../components/FunCounter";
import FunCities from "../components/FunCities";
import "./dashboard.css";
import Products from "../components/Products";
import Transactions from "../components/Transactions";
import Categories from "../components/Categories";
import UserForm from "../components/UserForm";
import DashboardPanel from "../components/DashboardPanel";
import ProductForm from "../components/ProductForm";
import Reports from "../components/Reports";
import CategoryForm from "../components/CategoryForm";
import Settings from "../components/Settings"
import Account from "../components/Account";

function Dashboard(props) {
	return (
		<div class="m-dashboard">
			<div className="content-wrap">
				<div className="d-sidebar">
					<Sidebar />
				</div>
				<div className="d-main">
					<div className="d-top-nav">
						<Header {...props}/>
					</div>
					<Switch>
						<Route
							path={`${props.match.path}/users/new`}
							component={UserForm}
						/>
						<Route
							path={`${props.match.path}/users/update/:id`}
							component={UserForm}
						/>
						<Route path={`${props.match.path}/users`} component={Users} />
						<Route
							path={`${props.match.path}/products/new`}
							component={ProductForm}
						/>
						<Route
							path={`${props.match.path}/products/update/:id`}
							component={ProductForm}
						/>
						<Route path={`${props.match.path}/products`} component={Products} />
						<Route
							path={`${props.match.path}/transactions`}
							component={Transactions}
						/>
						<Route
							path={`${props.match.path}/categories/new`}
							component={CategoryForm}
						/>
						<Route
							path={`${props.match.path}/categories/update/:id`}
							component={CategoryForm}
						/>
						<Route
							path={`${props.match.path}/categories`}
							component={Categories}
						/>
						<Route path={`${props.match.path}/report`} component={Reports} />
						<Route path={`${props.match.path}/setting`} component={Settings} />
						<Route path={`${props.match.path}/account`} component={Account} />
						<Route
							path={`${props.match.path}/`}
							component={DashboardPanel}
						/>
					</Switch>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
