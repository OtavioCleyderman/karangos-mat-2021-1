import {useState} from 'react'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import {makeStyles} from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import InputMask from 'react-input-mask'
import InputAdornment from '@material-ui/core/InputAdornment'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import React from 'react'


const useStyles = makeStyles (theme => ({
    form: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        maxWidth: '65%',
        margin: '0 auto', 
        '& .MuiFormControl-root' : {
            minWidth: '200px',
            maxWidth: '500px',
            margin: '0 24px 24px 0',
        }
    },
    toolbar: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-around',
        marginTop:'36px'
    }
}))

export default function KarangosForm() {

    const classes = useStyles()

    const years = []
    for(let i = (new Date()).getFullYear(); i >= 1900; i--) years.push(i)

    const colors = [
        'Amarelo',
        'Azul',
        'Bege',
        'Branco',
        'Cinza',
        'Dourado',
        'Laranja',
        'Marrom',
        'Prata',
        'Preto',
        'Rosa',
        'Roxo',
        'Verde',
        'Vermelho',
        'Vinho'
    ]

    // Classes de caracteres para a máscara da placa
    // 1) três primeira posições, somente letras (maiúsculas ou minúsculas) => [A-Za-z]
    // 2) quinta, sétima e oitava posições, somente dígitos - [0-9]
    // 3) sexta posição, dígitos ou letras (maiúsculas ou minúsculas) de A a J => [0-9A-Ja-j]
    const formatChars = {
        'A': '[A-Za-z]',
        '0': '[0-9]',
        '#': '[0-9A-Ja-j]'
    }



    // Máscara de entrada para a placa
    const placaMask = 'AAA-0#00'

    // Máscara para CPF: '000.000.000-00'
    // Máscara para CNPJ: '00.000.000/0000-00'

    const [karango, setkarango] = useState({
        id: null,
        marca: '',
        modelo: '',
        cor: '',
        ano_fabricacao: (new Date()).getFullYear(), // Ano corrente
        importado: 0,
        placa: '',
        preco: 0
    })

    const [currentId, setCurrentId] = useState()

    const [importadoChecked, setImportadoChecked] = useState(false)

    const [sendBtnStatus, setSendBtnStatus] = useState({
        disable: false,
        label: 'Enviar'
    })

    const [sbStatus, setSbStatus] = useState ({
        open: false,
        severity: 'success',
        message: ' '
    })

    const [error, setError] = useState({
        marca: " ",
        modelo: " ",
        placa: " ",
        preco: " "
    })

    const [isValid, setIsValid] = useState(false)

    const [isModified, setIsModified] = useState(false)


    const history = useHistory()

    function handleInputChange(event, property) {
        setCurrentId(event.target.id)
        if(event.target.id) property = event.target.id

        if(property === 'importado') {
            const newState = ! importadoChecked // Inverte o valor: Se true vira false, se false vira true
            if(newState) setkarango({...karango, importado: '1'})
            else setkarango({...karango, importado: '0'})
            setImportadoChecked(newState) 
        }
        else if(property === 'placa') {
            setkarango({...karango, placa: event.target.value.toUpperCase()})
        }
        else {
        /* Quando o nome de uma propriedade de objeto aparece entre [], significa
        que o nome da propriedade será determinada pela variável ou expressão
        contida dentro dos colchetes */
        setkarango({...karango, [property]: event.target.value})
        }
        setIsModified(true) // O formulário foi modificado
        validate() // Dispara a validação
    }

    function validate() {
        let valid = true
    
        const newErrors = {
          marca: '',
          modelo: '',
          placa: '',
          preco: ''
        }
    
        // trim(): retira espaços em branco do início e do final de uma string
        if(karango.marca.trim() === '') {
          newErrors.marca = 'A marca deve ser preenchida'
          valid = false
        }     
    
        if(karango.modelo.trim() === '') {
          newErrors.modelo = 'O modelo deve ser preenchido'
          valid = false
        }
    
        // A placa não pode ser string vazia nem conter sublinhado
        if(karango.placa.trim() === '' || karango.placa.includes('_')) {
          newErrors.placa = 'A placa deve ser preenchida corretamente'
          valid = false
        }
    
        // O preço deve ser numérico e maior que zero
        if(isNaN(karango.preco) || Number(karango.preco) <= 0) {
          newErrors.preco = 'O preço deve ser informado e maior que zero'
          valid = false
        }
    
        setError(newErrors)
        setIsValid(valid)
      }


    async function saveData() {
        try{
            // Desabilita o botão de enviar para evitar envio duplicado
            setSendBtnStatus({disable: true, label: 'Enviando...'})
            await axios.post('https://api.faustocintra.com.br/karangos', karango)
            // mostra snackBar
            setSbStatus({open: true, severity: 'success', message: 'Dados salvos com sucesso!'})
        }
        catch(error) {
           // mostra snackBar
           setSbStatus({open: true, severity: 'error', message: 'ERRO: ' + error.message})
        }
        // Restaura o estado inicial do botão
        setSendBtnStatus({disable: false, label: "Enviar"})
    }

    function handleSubmit(event) {
        event.preventDefault() // Evita que a página seja recarregada
        saveData()
    }

    function handleSbClose() {
        setSendBtnStatus({...sbStatus, open: false})

        // Retorna para a página de listagem
        if(sbStatus.severity === 'success')  history.push('/list')  
    }



    return(
    <>

    <Snackbar open={sbStatus.open} autoHideDuration={6000} onClose={handleSbClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSbClose} severity={sbStatus.severity}>
          {sbStatus.message}
        </MuiAlert>
     </Snackbar>

        <h1>Cadastrar novo karango</h1>
        <form className={classes.form} onSubmit={handleSubmit}>
            
            <TextField 
                id="marca" 
                label="Marca" 
                variant="filled" 
                value={karango.marca}
                onChange={handleInputChange}
                placeholder="Informe a marca do veículo"
                required /* not null, precisa ser preenchido */
                fullWidth
                error={error.marca !== ''}
                helperText={error.marca}
            /> 
            <TextField 
                id="modelo" 
                label="Modelo" 
                variant="filled" 
                value={karango.modelo}
                onChange={handleInputChange}
                placeholder="Informe o modelo do veículo"
                required /* not null, precisa ser preenchido */
                fullWidth
                error={error.modelo !== ''}
                helperText={error.modelo}
            />
            
            <TextField 
                id="cor" 
                label="Cor" 
                variant="filled" 
                value={karango.cor}
                onChange={event => handleInputChange(event, 'cor')}
                placeholder="Informe a cor do veículo"
                required /* not null, precisa ser preenchido */
                select
                fullWidth
            >
                {colors.map(color => <MenuItem value={color}> {color} </MenuItem>)}
            </TextField>

            <TextField 
                id="ano_fabricacao" 
                label="Ano de Fabricação" 
                variant="filled" 
                value={karango.ano_fabricacao}
                onChange={event => handleInputChange(event, 'ano_fabricacao')}
                placeholder="Informe o ano de fabricação do veículo"
                required /* not null, precisa ser preenchido */
                select
                fullWidth
            >
                {years.map(year => <MenuItem value={year}> {year} </MenuItem>)}
            </TextField>

            <InputMask
                id="placa"
                mask={placaMask}
                formatChars={formatChars}
                onChange={(event) => handleInputChange(event, 'placa')}
                value={karango.placa}
            >    
                {() => <TextField 
                    label="Placa" 
                    variant="filled" 
                    placeholder="Informe a placa do veículo"
                    required /* not null, precisa ser preenchido */
                    fullWidth
                    error={error.placa !== ''}
                    helperText={error.placa}
                /> }

            </InputMask>

            <TextField 
                id="preco" 
                label="Preço" 
                variant="filled" 
                value={karango.preco}
                onChange={handleInputChange}
                placeholder="Informe o valor do veículo"
                required /* not null, precisa ser preenchido */
                fullWidth
                type="number"
                onFocus={event => event.target.select()} // Seleciona o conteúdo ao focar
                InputProps={{
                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  }}
                error={error.preco !== ''}
                helperText={error.preco}
            /> 

            <FormControl fullWidth>
                <FormControlLabel control={
                    <Checkbox
                        id="importado"
                        checked={importadoChecked}
                        onChange={handleInputChange}
                    />
                }
                label="karango importado?"
                />
            </FormControl>

            <Toolbar className={classes.toolbar}>
                <Button 
                type="submit" 
                variant="contained" 
                color="secondary"
                
                disable={sendBtnStatus.disable}>
                    {sendBtnStatus.label}
                </Button>

                <Button variant="contained">Voltar</Button>
            </Toolbar>

            <div>
                <div>{JSON.stringify(karango)}</div>
                <br />
                currentId: {currentId}
                <br />
                isValid: {JSON.stringify(isValid)}
                <br />
                isModified: {JSON.stringify(isModified)}
            </div>
        </form>
    </>
    )
}