import { parse, format } from 'date-fns';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Radio, Dialog, TextField, FormLabel, RadioGroup, DialogTitle, FormControl, DialogActions, DialogContent, InputAdornment, FormControlLabel, DialogContentText } from '@mui/material';

import useApiService from 'src/services/api_services';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snakbar/SnackbarContext';

import TableNoData from '../table-no-data';
import TableEmptyRows from '../table-empty-row';
import TransactionTableRow from '../transaction-table-row';
import TransactionTableHead from '../transaction-table-head';
import { emptyRows, applyFilter, getComparator } from '../utils';
import TransactionTableToolbar from '../transaction-table-toolbar';


// ----------------------------------------------------------------------
const Transition = forwardRef((props, ref) => (
    <Slide direction="left" ref={ref} {...props} />
));


export default function TransactionPage() {

    const { showSnackbar } = useSnackbar();

    const { getAccount, addTransaction,getUserTransaction } = useApiService();

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [account, setAccount] = useState([{ "label": "", "id": 0 }]);

    const [transaction, setTransaction] = useState({ "accountId": 0, "type": "", "tdate": format(new Date(), "yyyy-MM-dd"), "amount": 0, "description": "" });
    const [open, setOpen] = useState(false);
    const [transactiontData, setTransactiontData] = useState([]);
    const [load, setLoad] = useState(true);

    const getAccountDetails = useCallback(async () => {
        const response = await getAccount();
        console.log('res', response);
        setAccount(response.map((element) =>
            ({ "label": element.title, "id": element.id })
        ))
    }, [getAccount]);

    const getTransaction = useCallback(async () => {
        const response = await getUserTransaction();
        console.log('res', response);
        setTransactiontData(response);
        setLoad(false);
    }, [getUserTransaction]);


    useEffect(() => {
        if (load) {
            getAccountDetails();
            getTransaction();
        }
    }, [load, getAccountDetails, getTransaction])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTransaction({ "accountId": 0, "type": "", "tdate": format(new Date(), "yyyy-MM-dd"), "amount": 0, "description": "" });
    };

    const saveTransaction = async () => {
        const response = await addTransaction(transaction);
        if (response.status === "OK") {
            console.log(response);
            showSnackbar(response.message, 'success');
            getAccountDetails();
            getTransaction();
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "amount") {
            if (/^\d*\.?\d{0,2}$/.test(value)) {
                setTransaction((prevState) => ({
                    ...prevState,
                    [name]: value
                }));
            }
        } else {
            setTransaction((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    console.log('state', transaction);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = transactiontData.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const dataFiltered = applyFilter({
        inputData: transactiontData,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <Container>
            <Card>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0} paddingLeft={2} paddingRight={2} paddingTop={2}>
                    <Typography variant="h4">Transactions</Typography>

                    <Button variant="contained" color="inherit" onClick={handleClickOpen} startIcon={<Iconify icon="eva:plus-fill" />}>
                        New Transaction
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        TransitionComponent={Transition}
                        PaperProps={{
                            component: 'form',
                            onSubmit: (event) => {
                                event.preventDefault();
                                saveTransaction();
                                handleClose();
                            },
                        }}
                    >
                        <DialogTitle>New Transaction</DialogTitle>
                        <DialogContent>
                            <Stack spacing={2}>
                                <DialogContentText>
                                    Here, you may add credit and debit transactions to your account.
                                </DialogContentText>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Transaction Date"
                                        value={parse(transaction.tdate, "yyyy-MM-dd", new Date())}
                                        onChange={(newValue) => {
                                            console.log('date: ', newValue)
                                            setTransaction((prevState) => ({
                                                ...prevState,
                                                'tdate': format(newValue, "yyyy-MM-dd")
                                            }));
                                        }}
                                        format="yyyy-MM-dd"
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Account</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={transaction.accountId}
                                        label="Account"
                                        name='accountId'
                                        required
                                        placeholder='Select Account'
                                        onChange={handleChange}
                                    >
                                        {account.map((e) => (<MenuItem value={e.id}>{e.label}</MenuItem>))}

                                    </Select>
                                </FormControl>
                                <FormControl required component="fieldset">
                                    <FormLabel component="legend">Transaction Type: </FormLabel>
                                    <RadioGroup row aria-label="options" name="type" value={transaction.type} onChange={handleChange}>
                                        <FormControlLabel sx={{ color: transaction.type === "CREDIT" ? 'green' : 'default' }} value="CREDIT" control={<Radio color='success' />} label="Credit" />
                                        <FormControlLabel sx={{ color: transaction.type === "DEBIT" ? 'red' : 'default' }} value="DEBIT" control={<Radio color='error' />} label="Debit" color='error' />
                                    </RadioGroup>
                                </FormControl>
                                <TextField
                                    label="Amount"
                                    name="amount"
                                    value={transaction.amount === 0 ? "" : transaction.amount}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        inputProps: { maxLength: 10 }
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    margin="dense"
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="description"
                                    maxRows={5}
                                    minRows={3}
                                    value={transaction.description}
                                    multiline
                                    onChange={handleChange}
                                    name="description"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                />

                            </Stack>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="secondary">Cancel</Button>
                            <Button type="submit" color='primary'>Add</Button>
                        </DialogActions>
                    </Dialog>
                </Stack>
                <TransactionTableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <TransactionTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={transactiontData.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: '', label: 'S.no' },
                                    { id: 'tid', label: 'Transaction ID' },
                                    { id: 'tDate', label: 'Date' },
                                    { id: 'title', label: 'Account' },
                                    { id: 'type', label: 'Type', align: 'center' },
                                    { id: 'amount', label: 'Amount', align: 'right' },
                                    { id: '', label: 'Action', align: 'center' }
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <TransactionTableRow
                                            key={row.id}
                                            sno={index + 1}
                                            title={row.title}
                                            tid={row.tid}
                                            amount={row.amount}
                                            type={row.type}
                                            tDate={row.tdate}
                                            selected={selected.indexOf(row.name) !== -1}
                                            handleClick={(event) => handleClick(event, row.name)}
                                        />
                                    ))}

                                <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, rowsPerPage, transactiontData.length)}
                                />

                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    page={page}
                    component="div"
                    count={transactiontData.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
