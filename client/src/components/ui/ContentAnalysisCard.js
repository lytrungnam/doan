import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Divider,
  Typography,
  Box,
  Chip,
  Grid,
  LinearProgress,
} from '@material-ui/core';
import {
  AccessTime as TimeIcon,
  Category as CategoryIcon,
  Warning as WarningIcon,
  Check as CheckIcon,
} from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    position: 'relative',
    backgroundSize: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  safeChip: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  warningChip: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
  dangerChip: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  cardContent: {
    flexGrow: 1,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  infoIcon: {
    marginRight: theme.spacing(1),
    fontSize: 20,
  },
  progressContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  cardActions: {
    padding: theme.spacing(2),
  },
}));

const ContentAnalysisCard = ({ analysis }) => {
  const classes = useStyles();
  
  const {
    _id,
    contentType,
    filename,
    createdAt,
    detectionResults,
    thumbnailUrl,
    confidenceScore,
  } = analysis;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getStatusChip = () => {
    if (confidenceScore > 0.8) {
      return (
        <Chip
          icon={<WarningIcon />}
          label="Nội dung độc hại"
          className={`${classes.chip} ${classes.dangerChip}`}
        />
      );
    } else if (confidenceScore > 0.3) {
      return (
        <Chip
          icon={<WarningIcon />}
          label="Có thể độc hại"
          className={`${classes.chip} ${classes.warningChip}`}
        />
      );
    } else {
      return (
        <Chip
          icon={<CheckIcon />}
          label="An toàn"
          className={`${classes.chip} ${classes.safeChip}`}
        />
      );
    }
  };

  const getProgressColor = () => {
    if (confidenceScore > 0.8) {
      return 'error';
    } else if (confidenceScore > 0.3) {
      return 'warning';
    } else {
      return 'success';
    }
  };

  return (
    <Card className={classes.card} elevation={3}>
      <div
        className={classes.cardMedia}
        style={{ backgroundImage: `url(${thumbnailUrl || '/placeholder.png'})` }}
      >
        {confidenceScore > 0.3 && (
          <div className={classes.overlay}>
            <Typography variant="h5" component="div" color="white">
              Nội dung không phù hợp
            </Typography>
          </div>
        )}
      </div>
      
      <CardHeader
        title={filename}
        subheader={contentType === 'image' ? 'Hình ảnh' : 'Video'}
        action={getStatusChip()}
      />
      
      <Divider />
      
      <CardContent className={classes.cardContent}>
        <Box className={classes.infoRow}>
          <TimeIcon className={classes.infoIcon} color="action" />
          <Typography variant="body2" color="textSecondary">
            {formatDate(createdAt)}
          </Typography>
        </Box>
        
        <Box className={classes.infoRow}>
          <CategoryIcon className={classes.infoIcon} color="action" />
          <Typography variant="body2" color="textSecondary">
            {detectionResults && detectionResults.categories ? 
              detectionResults.categories.join(', ') : 
              'Không có danh mục'
            }
          </Typography>
        </Box>
        
        <Box className={classes.progressContainer}>
          <Typography variant="body2" gutterBottom>
            Mức độ nguy hiểm: {Math.round(confidenceScore * 100)}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={confidenceScore * 100} 
            color={getProgressColor()}
          />
        </Box>
      </CardContent>
      
      <Divider />
      
      <CardActions className={classes.cardActions}>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to={`/app/reports/${_id}`}
          fullWidth
        >
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  );
};

export default ContentAnalysisCard;