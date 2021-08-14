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

export default function Settings(props) {
	const classes = useStyles();
	const [formData, setFormData] = useState({});
	const [method, setMethod] = useState("POST");

	const [errors, setErrors] = useState(null);
	useEffect(() => {
			axios(`${process.env.REACT_APP_BACKEND_API}setting`).then(
				(result) => {
					if (result.data.status === "success") {
						console.log(result.data.data)
                        let data = filterData(result.data.data)
						setFormData(data);
					}
				},
			);
	}, []);
	console.log(formData);
    const filterData = (data) => {
        console.log(data)
        console.log("here")
        let newData = {
            name: data.name,
            discount: data.discount,
            tax: data.tax,
            id: data._id
        }
        return newData;
    }

	const handleChange = (e) => {
		setFormData({...formData, [e.target.name]: e.target.value });
	};

	const categoryFormSchema = {
		name: Joi.string().required().min(4).max(50),
		discount: Joi.number().required().min(1).max(50),
		tax: Joi.number().required().min(1).max(50),
        id: Joi.string().required().min(1).max(50),
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
		if (localStorage.getItem("role") === "Admin"){
		axios({
			method: "PUT",
			url: `${process.env.REACT_APP_BACKEND_API}setting/${formData.id}}`,
			data: formData,
		})
			.then((result) => {
				console.log(result)
				if (result.data.status === "success") {
					setErrors(null);
					Swal.fire(
						"Success",
						`Store Settings Updated successfully...`,
						"success",
					);
					props.history.goBack();
				} else {
					Swal.fire("Opps", "Something went wrong...", "error");
				}
			})
			.catch((err) => Swal.fire("Opps", "Something went wrong...", err));
		}else{
			Swal.fire(
				"Opps",
				`You Don't Have Permissions To Update Store Settings...`,
				"error",
			);
			props.history.goBack();
		}
		};

	return (
		<Container component="main" maxWidth="lg">
			<Typography component="h1" variant="h5">
				<Button variant="defult" onClick={() => props.history.goBack()}>
					<ArrowBackIcon />
				</Button>
				Store Settings
			</Typography>

			<Paper>
				<div className={classes.paper}>
					<form
						onSubmit={handleSubmit}
						onChange={handleChange}
						className={classes.form}
						noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={12}>
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
                            <Grid item xs={12} sm={6}>
                            <TextField
									name="discount"
									variant="outlined"
									required
									fullWidth
									id="discount"
									placeholder="Discount"
									InputLabelProps={{
										shrink: false,
									}}
									value={formData && formData.discount}
								/>
								{errors &&
									errors.find((error) => error.context.key === "discount") &&
									errors
										.filter((error) => error.context.key === "discount")
										.map((error) => (
											<p className="p-errors ">{error.message}</p>
										))}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>

                            <TextField
									name="tax"
									variant="outlined"
									required
									fullWidth
									id="tax"
									placeholder="Tax"
									InputLabelProps={{
                                        shrink: false,
									}}
									value={formData && formData.tax}
                                    />
								{errors &&
									errors.find((error) => error.context.key === "tax") &&
									errors
                                    .filter((error) => error.context.key === "tax")
                                    .map((error) => (
                                        <p className="p-errors ">{error.message}</p>
										))}
                        </Grid>
						</Grid>
							<Button
								type="submit"
								variant="contained"
								size="large"
								color="secondary"
								className="c-btn mt-5">
								Submit
							</Button>
					</form>
				</div>
			</Paper>
		</Container>
	);
}
