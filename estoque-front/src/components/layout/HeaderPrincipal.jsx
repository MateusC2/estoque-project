import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import logo from "../../../public/logo.png";

const HeaderPrincipal = () => {
  const styles = getStyles();

  return (
    <Box sx={styles.header}>
      <Box sx={styles.iconGroupContainer}> 
        <Button 
          component={Link} 
          to="/transacoes"
          sx={styles.iconButtonContainer} 
        >
          <Box sx={styles.TransactionsIconContainer}>
            <FolderIcon sx={styles.iconContent} />
          </Box>
        </Button>
      </Box>
    </Box>
  );
};

function getStyles() {
  const baseSize = { xs: 35, sm: 40 }; 
  const iconSize = { xs: 20, sm: 25 }; 
  const senaiRed = "rgba(177, 16, 16, 1)";
  const darkRed = "darkred"; 

  const iconBaseStyle = {
    width: baseSize,
    height: baseSize,
    borderRadius: "50%",
    backgroundColor: darkRed,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "4px solid white",
    color: "white",
    flexShrink: 0,
    transition: 'background-color 0.3s',
    '& .MuiSvgIcon-root': {
      fontSize: iconSize, 
    }
  };
  
  const iconContentStyle = {
    fontSize: iconSize,
  };

  return {
    header: {
      backgroundColor: senaiRed,
      width: "100%",
      height: "10vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      borderBottom: "1vh solid white",
    },
    iconGroupContainer: { 
      display: 'flex',
      alignItems: 'center', 
      gap: { xs: 0.5, sm: 1 },
      mr: { xs: 1, sm: 3 },
    },
    iconButtonContainer: {
      padding: 0,
      minWidth: 0,
      ml: { xs: 0.5, sm: 1 }, 
      '&:hover': {
        backgroundColor: 'transparent',
      }
    },
    iconContent: iconContentStyle,
    TransactionsIconContainer: {
      ...iconBaseStyle,
      '&:hover': {
        backgroundColor: "rgba(100, 0, 0, 1)",
      }
    },
    logo: {
      height: "35px",
      border: "4.5px solid white",
      borderRadius: 15,
      marginLeft: { xs: 8, sm: 30 }, 
    },
  };
}

export default HeaderPrincipal;
