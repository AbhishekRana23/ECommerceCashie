import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "query-string";
import {
	Button,
	Chip,
	Container,
	FormControl,
	Grid,
	Paper,
	InputLabel,
	Select,
	InputAdornment,
	OutlinedInput,
	LinearProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

function Categories(props) {
	const classes = useStyles();
	const [Category, setCategory] = useState(null);
	const [refresh, setRefresh] = useState(false);
	const [query, setQuery] = useState({
		limit: 100,
	});

	useEffect(() => {
		axios({
			url: `${process.env.REACT_APP_BACKEND_API}category?${queryString.stringify(
				query,
			)}`,
			headers: {
				authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		}).then((result) => {
			console.log(result)
			if (result.data.status === "success")
				setCategory(result.data.data.categories);
		});
	}, [refresh, query]);
	const handleDelete = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then((result) => {
			if (result.isConfirmed) {
				axios
					.delete(`${process.env.REACT_APP_BACKEND_API}category/${id}`, {
						headers: {
							authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					})
					.then((response) => {
						if (response.data.status === "success") {
							Swal.fire("Deleted!", "Category has been deleted..", "success");
							setRefresh(!refresh);
						} else {
							Swal.fire("Opps!", "Somthing went wrong..", "error");
						}
					})

					.catch((err) => {
						Swal.fire("Opps!", "Somthing went wrong..", "error");
					});
			}
		});
	};
	const handleQueryChange = (e) => {
		setCategory(null);
		setQuery({ ...query, [e.target.name]: e.target.value });
	};

	console.log(Category);
	return (
		<div>
			<Container>
				<p className="top-heading">Category Lists</p>
				<Grid container>
					<Link to={`${props.match.path}/new`}>
						<Button variant="contained" color="secondary">
							+ New Data
						</Button>
					</Link>
				</Grid>
				<Grid container justifyContent="flex-end">
					<form onChange={handleQueryChange}>
						<FormControl variant="outlined">
							<OutlinedInput
								id="outlined-adornment-password"
								name="keyword"
								placeholder="Keyword"
								endAdornment={
									<InputAdornment position="end">
										<SearchIcon />
									</InputAdornment>
								}
								labelWidth={70}
							/>
						</FormControl>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel htmlFor="outlined-age-native-simple">
								Sort By
							</InputLabel>
							<Select
								native
								value=""
								inputProps={{
									name: "sort",
									id: "outlined-age-native-simple",
								}}>
								<option aria-label="None" value="" />
								<option value="Newest">Newest</option>
								<option value="Oldest">Oldest</option>
								<option value="Name">Name</option>
							</Select>
						</FormControl>
					</form>
				</Grid>
				<Grid container>
					<Grid item xs={12}>
						<Paper>
							<Table className={classes.table} aria-label="simple table">
								<TableHead>
									<TableRow>
										<TableCell align="left">Category Name</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{Category ? (
										Category.map((Categorie) => (
											<TableRow key={Categorie._id}>
												<TableCell align="left">{Categorie.name}</TableCell>
												<TableCell align="right">
													<Link
														to={`${props.match.path}/update/${Categorie._id}`}>
														<EditIcon />
													</Link>
													<DeleteIcon
														onClick={() => handleDelete(Categorie._id)}
													/>
												</TableCell>
											</TableRow>
										))
									) : (
										<Grid
											container
											style={{ width: "100%" }}
											justifyContent="center">
											<LinearProgress
												style={{ height: "20px", width: "100%" }}
											/>
										</Grid>
									)}
								</TableBody>
							</Table>
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</div>
	);
}

export default Categories;
