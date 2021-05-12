import { Toolbar, Typography } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import LocalCafeIcon from '@material-ui/icons/LocalCafe';

const useStyles = makeStyles((theme) => ({
    toolbar: {
        backgroundColor: theme.palette.background.paper,
        minHeight: '42px',
        width: '100%',
        // posicionar o footerBar na parte inferior da tela
        position: 'fixed',
        bottom: 0,
        
    },
    text: {
        width: '100%'
    },
    link: {
        color: theme.palette.secondary.light,
        textDecoration: 'none',
        '&:hover': { //mouse sobre o link
            textDecoration: 'underline' // volta o sublinhado
        }
    },
  }));

export default function FooterBar()  {
    const classes = useStyles();
    return (
        <Toolbar className={classes.toolbar}>
            <Typography variant='caption' display='block' color='textSecondary' align='center' className={classes.text}>
                Produzido com <LocalCafeIcon fontSize='small' /> by <a className={classes.link} href='https://github.com/OtavioCleyderman' target="_blank" rel="noreferrer">Otávio Cleyderman</a>
            </Typography>
        </Toolbar>
    )
}