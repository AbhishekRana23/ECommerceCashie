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
import VisibilityIcon from '@material-ui/icons/Visibility';
import SearchIcon from "@material-ui/icons/Search";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import RecieptModal from "./RecieptModal";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const ExportCSV = ({csvData, fileName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <Button className="mr-5" variant="contained" color="secondary" onClick={(e) => exportToCSV(csvData,fileName)}>Export</Button>
    )
}

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});


function Reports(props) {
	const classes = useStyles();
	const [report, setreport] = useState(null);
	const [filtered, setfiltered] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [transactionData, setTransactionData] = useState(null);
	const [refresh, setRefresh] = useState(false);
	const [oldDate, setoldDate] = React.useState(new Date());
	const [newDate, setnewDate] = React.useState(new Date(Date.now() + ( 3600 * 1000 * 48)));
	const [query, setQuery] = useState({
		limit: 10,
		start: moment().startOf("week").format("llll"),
		end: moment().endOf("week").format("llll"),
	});
	
	useEffect(() => {
		axios(
			`${process.env.REACT_APP_BACKEND_API}transaction?${queryString.stringify(
				query,
				)}`,
				).then((result) => {
					console.log(result)
					if (result.data.status === "success"){
						setreport(result.data.data.transactions);
						filterContents(result.data.data.transactions);
					} 
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
				.delete(`${process.env.REACT_APP_BACKEND_API}user/${id}`)
					.then((response) => {
						Swal.fire("Deleted!", "User has been deleted..", "success");
						setRefresh(!refresh);
					})
					.catch((err) => {
						Swal.fire("Opps!", "Somthing went wrong..", "error");
					});
				}
			});
		};
		const handleClickOpen = () => {
			setModalOpen(true);
		};
		const handleView = (data) => {
			setTransactionData(data);
			setModalOpen(true);
		}
		const handleClose = () => {
			setModalOpen(false);
		};
		const handleoldDateChange = (date) => {
			setoldDate(date);
			setQuery({ ...query, ["start"]: oldDate });
		};
		const handlenewDateChange = (date) => {
			setnewDate(date);
			console.log(newDate)
			setQuery({ ...query, ["end"]: newDate });
		};
		const handleQueryChange = (e) => {
			setreport(null);
			console.log(e.target)
			setQuery({ ...query, [e.target.name]: e.target.value });
		};

		const filterContents = (reports) => {
			console.log(reports)

			// <td>{customer._id}</td>
			// <td>{customer.subtotal}</td>
			// <td>{customer.grandtotal}</td>
			// <td>{customer.discount}</td>
			// <td>{customer.createdAt}</td>
			// <td>{customer.updatedAt}</td>
			let data = []
			reports.forEach((report) => {
				data.push({Id: report["_id"], 
					subTotal: report["subtotal"],
					Grandtotal: report["grandtotal"],
					Discount: report["discount"],
					CreatedAt: report["createdAt"],
					UpdatedAt: report["updatedAt"],
			  })
			})
			setfiltered(data)
	}

		
	console.log(query);
	return (
		<div>
			<Container>
			<p className="top-heading">Reports</p>
				<Grid container>
					<ExportCSV csvData={filtered} fileName={`Report-${moment().format("ll")}`} />
				</Grid>
				<Grid container justifyContent="flex-end">
					<form onChange={handleQueryChange}>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDatePicker
						margin="normal"
						name="start"
						id="date-picker-dialog"
						label="Start"
						format="MM/dd/yyyy"
						value={oldDate}
						onChange={handleoldDateChange}
						KeyboardButtonProps={{
							'aria-label': 'change-date',
						}}
						/>
						<KeyboardDatePicker
						name="end"
						margin="normal"
						id="date-picker-dialog"
						label="End"
						format="MM/dd/yyyy"
						value={newDate}
						onChange={handlenewDateChange}
						KeyboardButtonProps={{
							'aria-label': 'change-date',
						}}
						/>
					</MuiPickersUtilsProvider>
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
										<TableCell>Id</TableCell>
										<TableCell align="right">Date</TableCell>
										<TableCell align="right">Qty</TableCell>
										<TableCell align="right">Grandtotal</TableCell>
										<TableCell align="right">{" "}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{report ? (
										report.map((report) => (
											<TableRow key={report._id}>
												<TableCell component="th" scope="row">
													{report._id}
												</TableCell>
												<TableCell align="right">{moment(report.createdAt).format("llll")}</TableCell>
												<TableCell align="right">{report.items.length}</TableCell>
												<TableCell align="right">{report.grandtotal}</TableCell>
												<TableCell align="right">
													<VisibilityIcon onClick={()=> handleView(report)}/>
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
			<RecieptModal
				isOpen={modalOpen}
				onOpen={handleClickOpen}
				onClose={handleClose}
				transactionData={transactionData}
			/>
		</div>
	);
}

export default Reports;
