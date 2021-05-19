import {useState, useEffect} from 'react'
import axios from 'axios'
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import AddBoxIcon from '@material-ui/icons/AddBox';
import { useHistory } from 'react-router-dom'
import ConfirmDialog from '../ui/ConfirmDialog'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';


const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
  },
  tableRow: {
      '& button': { // esconde os botões editar e excluir
          visibility: 'hidden' 
      },
      '&:hover button': { // volta a mostrar os botões editar e excluir da linha em que o mouse passar em cima
            visibility: 'visible'
      },
      '&:hover': {
          backgroundColor: theme.palette.action.hover
      }
  },
  toolbar: {
      justifyContent: 'flex-end',
      paddingRight: 0,
      margin: theme.spacing(2,0)
  }
}));



export default function KarangosList() {
    const classes = useStyles()

    // variáveis que conterão dados precisam ser inicializadas com vetores vazios 
    const [karangos, setKarangos] = useState([])
    const [deletable, setDeletable] = useState() // código do registro a ser excluído
    const [dialogOpen, setDialogOpen] = useState(false) // código de confirmação aberto?
    const [sbOpen, setSbOpen] = useState(false)
    const [sbSeverity, setSbSeverity] = useState('success')
    const [sbMessage, setSbMessage] = useState('Exclusão realizada com sucesso.')

    const history = useHistory()

    useEffect(() => {
        getData()
    }, []) // Quando a lista de dependências é um vetor vazio, o useEffect() é executado apenas uma vez,
           // no carregamento inicial do componente.

    async function  getData() {
        try {// tenta buscar os dados
            let response = await axios.get('https://api.faustocintra.com.br/karangos?by=marca,modelo')
            if(response.data.length > 0) setKarangos(response.data)
        }
        catch(error) {
            console.log(error)
        }
    }

    async function deleteItem() {
        try {
            await axios.delete(`https://api.faustocintra.com.br/karangos/${deletable}`)
            getData() // Atualiza os ddos da tabela
            setSbSeverity('success')
            setSbMessage('Exclusão efetuada com sucesso.')
        }
        catch(error) {
           setSbSeverity('error')
           setSbMessage('ERRO: ' + error.message)
        }
        setSbOpen(true) // Exibe a snackbar
    }
    function handleDialogClose(result) {
        setDialogOpen(false)
        // Se o usuário concordou com a exclusão 
        if(result) deleteItem()
    }

    function handleDelete(id) {
        setDeletable(id)
        setDialogOpen(true)
    }

    function handleSbClose() {
        setSbOpen(false) // Fecha a snackbar
    }

    return (
        <div>
            <ConfirmDialog isOpen={dialogOpen} onClose={handleDialogClose}>
                Deseja realmente exluir este karango?
            </ConfirmDialog>

            <Snackbar open={sbOpen} autoHideDuration={6000} onClose={handleSbClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleSbClose} severity={sbSeverity}>
                    {sbMessage}
                </MuiAlert>
            </Snackbar>

            <h1>Listagem de Karangos</h1>
            <Toolbar className={classes.toolbar}>
                <Button color="secondary" variant="contained" size="large" 
                startIcon={<AddBoxIcon />} onClick={() => history.push('/new')}>
                    Novo Karango
                </Button>
            </Toolbar>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Cód.</TableCell>
                            <TableCell >Marca</TableCell>
                            <TableCell >Modelo</TableCell>
                            <TableCell >Cor</TableCell>
                            <TableCell align='center' >Ano</TableCell>
                            <TableCell align='center'>Importado?</TableCell>
                            <TableCell align='center' >Placa</TableCell>
                            <TableCell align='right' >Preço</TableCell>
                            <TableCell align='center' >Editar</TableCell>
                            <TableCell align='center' >Excluir</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {karangos.map((karango) => (
                            <TableRow key={karango.name} className={classes.tableRow}>
                                <TableCell >{karango.id}</TableCell>
                                <TableCell >{karango.marca}</TableCell>
                                <TableCell >{karango.modelo}</TableCell>
                                <TableCell >{karango.cor}</TableCell>
                                <TableCell align='center' >{karango.ano_fabricacao}</TableCell>
                                <TableCell align='center'>
                                    <Checkbox checked={karango.importado === '1'} readonly='readonly' />
                                </TableCell>
                                <TableCell align='center' >{karango.placa}</TableCell>
                                <TableCell align='right' >
                                    {Number(karango.preco).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                                </TableCell>

                                <TableCell align='center' >
                                    <IconButton aria-label="editar">
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                                
                                <TableCell align='center' >
                                    <IconButton aria-label="excluir" onClick={() => handleDelete(karango.id)}>
                                        <DeleteIcon color= "error"/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}