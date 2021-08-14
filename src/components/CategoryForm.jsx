import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { FormControl, InputLabel, Paper, Select } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Joi from "joi-browser";
import axios from "axios";
import Swal from "sweetalert2";

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(3),
		padding: "20px",
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function UserFrom(props) {
	const classes = useStyles();
	const [formData, setFormData] = useState({});
	const [method, setMethod] = useState("POST");

	const [errors, setErrors] = useState(null);
	useEffect(() => {
		let productId = props.match.params.id;
		productId &&
			axios(`${process.env.REACT_APP_BACKEND_API}category/${productId}`).then(
				(result) => {
					if (result.data.status === "success") {
						setFormData(result.data.data);
						console.log(result.data.data)
						setMethod("PUT");
					}
				},
			);
	}, []);
	console.log(formData);

	const handleChange = (e) => {
		setFormData({ [e.target.name]: e.target.value });
	};

	const categoryFormSchema = {
		name: Joi.string().required().min(4).max(50)
	};

	console.log(formData);
	const handleSubmit = (e) => {
		e.preventDefault();
		//validate form data

		let validation = Joi.validate(formData, categoryFormSchema, {
			abortEarly: false,
		});
		if (validation.error) {
			setErrors(validation.error.details);
			return;
		}
		axios({
			method: method,
			url: `${process.env.REACT_APP_BACKEND_API}${
				method === "PUT" ? "category/" + props.match.params.id : "category"
			}`,
			data: formData,
		})
			.then((result) => {
				console.log(result)
				if (result.data.status === "success") {
					setErrors(null);
					Swal.fire(
						"Success",
						`Category ${method === "PUT" ? "updated" : "created"} successfully...`,
						"success",
					);
					props.history.goBack();
				} else {
					Swal.fire("Opps", "Something went wrong...", "error");
				}
			})
			.catch((err) => Swal.fire("Opps", "Something went wrong...", err));
	};
	console.log(errors);
	console.log(formData);
	return (
		<Container component="main" maxWidth="lg">
			<Typography component="h1" variant="h5">
				<Button variant="defult" onClick={() => props.history.goBack()}>
					<ArrowBackIcon />
				</Button>
				New Category
			</Typography>

			<Paper>
				<div className={classes.paper}>
					<form
						onSubmit={handleSubmit}
						onChange={handleChange}
						className={classes.form}
						noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									name="name"
									variant="outlined"
									required
									fullWidth
									id="name"
									placeholder="Name"
									name="name"
									InputLabelProps={{
										shrink: false,
									}}
									value={formData && formData.name}
								/>
								{errors &&
									errors.find((error) => error.context.key === "name") &&
									errors
										.filter((error) => error.context.key === "name")
										.map((error) => (
											<p className="p-errors ">{error.message}</p>
										))}
							</Grid>
						</Grid>
						{method === "POST" ? (
							<Button
								type="submit"
								variant="contained"
								size="large"
								color="secondary"
								className="c-btn mt-5">
								Create
							</Button>
						) : (
							<Button
								type="submit"
								variant="contained"
								size="large"
								color="secondary"
								className="c-btn mt-5">
								Update
							</Button>
						)}
					</form>
				</div>
			</Paper>
		</Container>
	);
}
