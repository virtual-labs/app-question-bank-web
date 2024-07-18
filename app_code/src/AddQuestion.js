import React, { useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { Card, CardContent } from '@mui/material';
import { useState } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { Box, CircularProgress, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { initialTags } from './tagsColors';
import MarkdownRenderer from './MarkdownRenderer';
import "./App.css";
// import { onAuthStateChange } from 'firebase/auth';
// import { storage } from "firebase"

// Firestore
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, Firestore } from 'firebase/storage';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from "./firebaseConfig.js"
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js';
import { Center } from '@chakra-ui/react';
// const app = initializeApp(firebaseConfig);

const db = getFirestore();

const EASY_DIFFICULTY = 10;
const MEDIUM_DIFFICULTY = 20;
const HARD_DIFFICULTY = 30;

function Form(token) {
	const [comboBoxCount, setComboBoxCount] = React.useState(1);
	const [selectedTags, setSelectedTags] = React.useState([]);
	const [selectedtags, setselectedtags] = React.useState([]);
	const [tags, setTags] = React.useState(initialTags);

	const [question, setQuestion] = React.useState('');
	const [optionA, setOptionA] = React.useState('');
	const [optionB, setOptionB] = React.useState('');
	const [optionC, setOptionC] = React.useState('');
	const [optionD, setOptionD] = React.useState('');
	const [explanationA, setExplanationA] = React.useState('');
	const [explanationB, setExplanationB] = React.useState('');
	const [explanationC, setExplanationC] = React.useState('');
	const [explanationD, setExplanationD] = React.useState('');

	const [Difficulty, setDifficulty] = React.useState('');
	const [CorrectOption, setCorrectOption] = React.useState('');
	const [errorMessage, setErrorMessage] = React.useState('');
	const [image, setImageUpload] = useState(null);
	const [image_url] = useState(null);
	const [previewVisible, setPreviewVisible] = useState(false);
	const [previewPageVisible, setPreviewPageVisible] = useState(false);

	const handleComboBoxChange = (event, value, comboBoxId) => {
		setSelectedTags((prevSelectedTags) => {
			const updatedTags = [...prevSelectedTags];
			updatedTags[comboBoxId] = value;
			return updatedTags;
		});
	};

	const togglePreview = () => {
		setPreviewVisible(!previewVisible);
	};
	const togglePreviewPage = () => {
		// Here, the order of if matters

		if (previewPageVisible == false) {
			setPreviewVisible(true);
		}
		else {
			setPreviewVisible(false);
		}

		setPreviewPageVisible(!previewPageVisible);

	};


	const handleLogButtonClick = () => {
		if (selectedTags.length === 0) {
			setErrorMessage('Please select a tag from the list.');
			return;
		}

		const isAllTagsValid = selectedTags.every(tag => tags.includes(tag));

		if (!isAllTagsValid) {
			setErrorMessage('Please select tags only from the list.');
			return;
		}

		const newselectedtags = [...selectedtags, [...selectedTags]];
		setselectedtags(newselectedtags);

		// Remove selected tags from the available tags
		const updatedTags = tags.filter(tag => !selectedTags.includes(tag));
		setTags(updatedTags);

		setSelectedTags([]);
	};

	const removeTagFromHistory = (indexToRemove) => {
		const updatedselectedtags = selectedtags.filter((_, index) => index !== indexToRemove);
		setselectedtags(updatedselectedtags);
		setTags([...tags, ...selectedtags[indexToRemove]]);
	};

	const handleChange = (event) => {
		setDifficulty(event.target.value);
	};
	const handleChange2 = (event) => {
		setCorrectOption(event.target.value);
	}

	const displayselectedtags = () => {
		return (
			<div>
				<div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
					{selectedtags.map((tags, historyIndex) => (
						<div key={historyIndex} style={{ display: 'flex', flexDirection: 'column', marginRight: '20px' }}>
							{tags.map((tag, tagIndex) => (
								<div
									key={tagIndex}
									style={{
										display: 'inline-flex',
										alignItems: 'center',
										backgroundColor: tag.color,
										color: '#fff',
										paddingLeft: '10px',
										paddingRight: '10px',
										paddingTop: '5px',
										paddingBottom: '5px',
										borderRadius: '15px',
										marginBottom: '5px',
									}}
								>
									{tag.label}
									<IconButton
										size="small"
										onClick={() => removeTagFromHistory(historyIndex, tagIndex)}
										style={{ marginLeft: '8px', color: '#fff' }}
									>
										<CloseIcon fontSize="small" />
									</IconButton>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		);
	};



	const handleClearSubmit = async () => {
		if (!optionA || !explanationA || !optionB || !explanationB || !optionC || !explanationC || !optionD || !explanationD
			|| !question || !CorrectOption || !Difficulty
		) {
			setErrorMessage('Please fill in the required fields');
			return;
		}
		const questionField = document.getElementById('Question');
		if (questionField && !questionField.value.trim()) {
			// Display an alert if the required field is not filled
			setErrorMessage('Please fill in the required fields');
			return;
		}
		if (selectedtags.length === 0) {
			setErrorMessage('Please select a tag from the tag list.');
			return;
		}


		let uploadTask = false;

		// Image Part
		if (image) {
			const storage = getStorage();
			const storageRef = ref(storage, `images/${image.name}`);
			uploadTask = image ? uploadBytesResumable(storageRef, image) : null;
		}
		let image_url = "";

		if (uploadTask) {
			uploadTask.on('state_changed',
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + progress + '% done');
					switch (snapshot.state) {
						case 'paused':
							console.log('Upload is paused');
							break;
						case 'running':
							console.log('Upload is running');
							break;
					}
				},
				(error) => {
					console.log("Error in uploading!");
				},
				() => {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
					getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
						console.log('File available at', downloadURL);
						image_url = downloadURL;
						console.log(image_url);
						console.log("Hi!");
						proceedWithData();
					});
				});
		}


		else {
			proceedWithData();
		}

		function proceedWithData() {
			console.log(image_url);

			const formData = constructFormData(CorrectOption, Difficulty, selectedtags, image_url);

			// if (formData.correctAnswer==1)
			// formData.correctAnswer='a';
			// else if(formData.correctAnswer==2)
			// formData.correctAnswer='b';
			// else if(formData.correctAnswer==3)
			// formData.correctAnswer='c';
			// else if(formData.correctAnswer==4)
			// formData.correctAnswer='d';

			console.log(typeof formData);
			// CODE TO SUBMIT THE FORM DATA TO THE SERVER
			const list_to_be_sent = []
			list_to_be_sent.push(formData);
			// console.log(JSON.stringify(list_to_be_sent));

			const requestBody = {
				"version": 1,
				"questions": list_to_be_sent
			};
			console.log(token.token);
			fetch('https://vlabs-question-bank.el.r.appspot.com/api/questions',
				{
					method: 'POST',
					headers: {
					    'Content-Type': 'application/json',
						Authorization: `Bearer ${token.token}`,
					},
					body: JSON.stringify(requestBody)
				})
				.then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					return response.json();
				})
				.then(data => {
					console.log('Success (ok 200):', data);
				})
				.catch(error => {
					console.error('Error:', error);
				});

			setselectedtags([]);
			setTags(initialTags);
			setSelectedTags([]);
			setDifficulty('');
			setCorrectOption('');
			setQuestion('');
			setOptionA('');
			setOptionB('');
			setOptionC('');
			setOptionD('');
			setExplanationA('');
			setExplanationB('');
			setExplanationC('');
			setExplanationD('');
			setErrorMessage('');
			setComboBoxCount(1);
			alert('Question submitted successfully');
		}
	};

	const handleFileChange = (e) => {
		const files = e.target.files;
		if (files.length > 0) {
			const selectedFile = files[0];
			setImageUpload(selectedFile);
			// Display selected image
			const reader = new FileReader();
			reader.onload = (event) => {
				document.getElementById('selected-image').src = event.target.result;
			};
			reader.readAsDataURL(selectedFile);
		} else {
			// Handle cancel action
			// You can reset the image state or handle the cancel action accordingly
		}
	};

	const handleRemoveImage = () => {
		setImageUpload(null);
		// Clear the image preview
		document.getElementById('selected-image').src = '';
		const fileInput = document.getElementById('file-upload');
		fileInput.value = ''; // Reset the input value to clear the selected file
	};

	return (
		<Stack
			direction="column"
			spacing={2}
			justifyContent="center"
			alignItems="center"
			style={{ minHeight: '100vh' }}
		>
			<div style={{ display: 'flex', gap: '10px', marginTop: "5%" }}>
				{/* Button to toggle visibility of preview div */}
				<Button variant="contained" onClick={togglePreview} disabled={previewPageVisible}>
					{previewVisible ? 'Hide Preview' : 'Preview'}
				</Button>
				{/* Button to toggle visibility of preview page*/}
				<Button variant="contained" onClick={togglePreviewPage}>
					{previewPageVisible ? 'Hide Preview Page' : 'Preview Page'}
				</Button>
			</div>
			<div>
				<hr style={{ width: "600px" }} />
				<h3>Question</h3>
				{!previewPageVisible && (
					<div>
						<TextField
							id="Question"
							label="Enter Question"
							placeholder="Enter Question"
							multiline
							rows={2}
							fullWidth
							sx={{ width: 600 }}
							required
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							style={{ marginBottom: "2.5%" }}
						/>
						<input
							type="file"
							id="file-upload"
							onChange={handleFileChange}
							style={{
								display: 'none'
							}}
						/>
						<label htmlFor="file-upload" style={{
							cursor: 'pointer',
							backgroundColor: '#3f51b5',
							color: '#fff',
							padding: '5px 10px',
							borderRadius: '5px',
						}}>
							Choose File
						</label>
						<br />
					</div>)}
				{image && ( // Only display the remove button if an image is selected
					<button onClick={handleRemoveImage} style={{
						backgroundColor: 'red',
						color: '#fff',
						padding: '5px 10px',
						borderRadius: '5px',
						cursor: 'pointer'
					}}>
						Remove Image
					</button>
				)}
				{/* Add an img element to display selected image */}
				{image ? (
					<img id="selected-image" src={URL.createObjectURL(image)} alt="Selected Image" style={{
						maxWidth: '100%',
						maxHeight: '200px',
						marginTop: '10px',
					}} />
				) : (
					<div><br></br>No image selected</div>
				)}
				{/* Separate div for preview */}
				{previewVisible && (
					<div style={{ width: '100%' }}>

						<MarkdownRenderer maxLines={5} source={question} />
					</div>
				)}
			</div>
			<Stack spacing={2}>
				<hr style={{ width: "600px" }} />
				<div>
					<h4>Option A</h4>
					{!previewPageVisible && (
						<TextField
							id="Option-A"
							label="Option A"
							placeholder="Enter Option A"
							multiline
							rows={2}
							fullWidth
							sx={{ width: 600 }}
							required
							value={optionA}
							onChange={(e) => setOptionA(e.target.value)}
						/>
					)}
					{previewVisible && (
						<div>

							<MarkdownRenderer maxLines={5} source={optionA} />
						</div>
					)}
				</div>
				<div>
					<h4>Explanation for Option A</h4>
					{!previewPageVisible && (
						<TextField
							id="Explanation-A"
							label="Explanation for Option A"
							placeholder="Enter Explanation for Option A"
							multiline
							rows={2}
							fullWidth
							sx={{ width: 600 }}
							required
							value={explanationA}
							onChange={(e) => setExplanationA(e.target.value)}
						/>
					)}
					{previewVisible && (
						<div >

							<MarkdownRenderer maxLines={5} source={explanationA} style={{ width: "100%" }} />
						</div>
					)}
				</div>
			</Stack>
			<Stack spacing={2}>
				<hr style={{ width: "600px" }} />
				<div>
					<h4>Option B</h4>
					{!previewPageVisible && (

						<TextField
							id="Option-B"
							label="Option B"
							placeholder="Enter Option B"
							multiline
							rows={2}
							fullWidth
							sx={{ width: 600 }}
							required
							value={optionB}
							onChange={(e) => setOptionB(e.target.value)}
						/>
					)}
					{previewVisible && (
						<div>

							<MarkdownRenderer maxLines={5} source={optionB} />
						</div>
					)}
				</div>
				<div>
					<h4>Explanation for Option B</h4>
					{!previewPageVisible && (
						<TextField
							id="Explanation-B"
							label="Explanation for Option B"
							placeholder="Enter Explanation for Option B"
							multiline
							rows={2}
							fullWidth
							sx={{ width: 600 }}
							required
							value={explanationB}
							onChange={(e) => setExplanationB(e.target.value)}
						/>
					)}
					{previewVisible && (
						<div>

							<MarkdownRenderer maxLines={5} source={explanationB} />
						</div>
					)}
				</div>
			</Stack>
			<Stack spacing={2}>
				<hr style={{ width: "600px" }} />
				<div>
					<h4>Option C</h4>
					{!previewPageVisible && (

						<TextField
							id="Option-C"
							label="Option C"
							placeholder="Enter Option C"
							multiline
							rows={2}
							fullWidth
							sx={{ width: 600 }}
							required
							value={optionC}
							onChange={(e) => setOptionC(e.target.value)}
						/>
					)}
					{previewVisible && (
						<div>

							<MarkdownRenderer maxLines={5} source={optionC} />
						</div>
					)}
				</div>

				<div>
					<h4>Explanation for Option C</h4>
					{!previewPageVisible && (
						<TextField
							id="Explanation-C"
							label="Explanation for Option C"
							placeholder="Enter Explanation for Option C"
							multiline
							rows={2}
							fullWidth
							sx={{ width: 600 }}
							required
							value={explanationC}
							onChange={(e) => setExplanationC(e.target.value)}
						/>
					)}
					{previewVisible && (
						<div>

							<MarkdownRenderer maxLines={5} source={explanationC} />
						</div>
					)}
				</div>
			</Stack>
			<Stack spacing={2}>
				<hr style={{ width: "600px" }} />
				<div>
					<h4>Option D</h4>
					{!previewPageVisible && (
						<TextField
							id="Option-D"
							label="Option D"
							placeholder="Enter Option D"
							multiline
							rows={2}
							fullWidth
							sx={{ width: 600 }}
							required
							value={optionD}
							onChange={(e) => setOptionD(e.target.value)}
						/>
					)}
					{previewVisible && (
						<div>

							<MarkdownRenderer maxLines={5} source={optionD} />
						</div>
					)}
				</div>
				<div>
					<h4>Explanation for Option D</h4>
					{!previewPageVisible && (
						<TextField
							id="Explanation-D"
							label="Explanation for Option D"
							placeholder="Enter Explanation for Option D"
							multiline
							rows={2}
							fullWidth
							required
							value={explanationD}
							onChange={(e) => setExplanationD(e.target.value)}
						/>
					)}
					{previewVisible && (
						<div>

							<MarkdownRenderer maxLines={5} source={explanationD} />
						</div>
					)}
				</div>
			</Stack>
			<Stack spacing={2}>
				<FormControl fullWidth="true" required>
					<InputLabel id="demo-simple-select-label-2">Correct option</InputLabel>
					<Select
						labelId="demo-simple-select-label-2"
						id="select-correct-option"
						value={CorrectOption}
						label="Correct option"
						onChange={handleChange2}
						sx={{ width: 300 }}
						MenuProps={{
							PaperProps: {
								style: {
									maxHeight: 48 * 2.5 + 8,
									width: 'ch',
								},
							}
						}}
					>
						<MenuItem value={1}>Option A</MenuItem>
						<MenuItem value={2}>Option B</MenuItem>
						<MenuItem value={3}>Option C</MenuItem>
						<MenuItem value={4}>Option D</MenuItem>
					</Select>
				</FormControl>
			</Stack>

			<Stack spacing={2}>
				<FormControl fullWidth="true" required>
					<InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="select-difficulty"
						value={Difficulty}
						label="Difficulty"
						onChange={handleChange}
						sx={{ width: 300 }}
						MenuProps={{
							PaperProps: {
								style: {
									maxHeight: 48 * 2.5 + 8,
									width: 'ch',
								},
							}
						}}
					>
						<MenuItem value={10} id="easy-difficulty">Easy</MenuItem>
						<MenuItem value={20}>Medium</MenuItem>
						<MenuItem value={30}>Hard</MenuItem>
					</Select>
				</FormControl>
			</Stack>


			<Stack spacing={2}>
				{[...Array(comboBoxCount)].map((_, index) => (
					<Autocomplete
						key={index}
						disablePortal
						id={`tags-outlined-${index}`}
						options={tags}
						sx={{ width: 300 }}
						onChange={(event, value) => handleComboBoxChange(event, value, index)}
						renderInput={(params) => <TextField {...params} label="enter tags" />}
					/>
				))}
			</Stack>

			<Stack direction="row" spacing={2}>
				<Button variant="contained" onClick={handleLogButtonClick} id="add-tag-button">
					Add Tag
				</Button>
			</Stack>
			<Stack direction="row" spacing={2}>
				<h3>Selected Tags</h3>
			</Stack>
			<Stack direction="row" spacing={2}>
				{displayselectedtags()}
			</Stack>
			<Stack direction="row" spacing={2}>
				<Button variant="contained" onClick={handleClearSubmit} id="submit-button">
					Submit
				</Button>
			</Stack>
			{errorMessage && (
				<Typography variant="body1" color="error">
					{errorMessage}
				</Typography>
			)}
		</Stack>
	);
}

function Answer() {
	return (
		<div>
			<h1>Answer</h1>
		</div>
	);
}
const constructFormData = (CorrectOption, Difficulty, selectedtags, imageUrl) => {
	const question = document.getElementById('Question').value;
	const optionA = document.getElementById('Option-A').value;
	const optionB = document.getElementById('Option-B').value;
	const optionC = document.getElementById('Option-C').value;
	const optionD = document.getElementById('Option-D').value;
	const correctOption = CorrectOption;
	const difficulty = Difficulty;
	const explanationA = document.getElementById('Explanation-A').value;
	const explanationB = document.getElementById('Explanation-B').value;
	const explanationC = document.getElementById('Explanation-C').value;
	const explanationD = document.getElementById('Explanation-D').value;
	const ImageUrl = imageUrl;

	console.log(imageUrl)

	var newDif;
	if (difficulty === EASY_DIFFICULTY) {
		newDif = 'easy'
	} else if (difficulty === MEDIUM_DIFFICULTY) {
		newDif = 'medium'
	} else {
		newDif = 'hard'
	}

	console.log(correctOption);

	const formData = {
		question: question,
		answers: {
			a: optionA,
			b: optionB,
			c: optionC,
			d: optionD
		},
		correctAnswer: correctOption,
		difficulty: newDif,
		explanations: {
			a: explanationA,
			b: explanationB,
			c: explanationC,
			d: explanationD
		},
		selectedTags: selectedtags.flat().map(tag => tag.label),
		image: imageUrl,
		user: 'divu@gmail.com'
	};

	return formData;
};

function AddToQueueSharption({ setquestions, setDownloadList, token, setToken, selectedRole, setSelectedRole }) {
	// setquestions([])

	useEffect(() => {
		setquestions([]);
	}, [setquestions]);
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true); // State to track loading status
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				// User is signed in, update state accordingly
				setIsAuthenticated(true);
				user.getIdToken().then((token1) => {
					// console.log(token);
					setToken(token1);
				});
				const userDoc = await getDoc(doc(db, 'users', user.uid));
				if (userDoc.exists()) {
					const userData = userDoc.data();
					setSelectedRole(userData.role);
				}
				else {
					console.error("No user data found!");
					setIsAuthenticated(false);
				}

			} else {
				// No user is signed in, update state accordingly
				setIsAuthenticated(false);
			}
			setIsLoading(false); // Set loading to false once the check is complete
		});

		return () => unsubscribe();
	}, [navigate, selectedRole, setSelectedRole, setToken]);

	if (isLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
				<CircularProgress />
			</Box>
		);
	}

	if (!isAuthenticated) {
		return (
			<Container maxWidth="sm">
				<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
					<Typography variant="h6" align="center">Access Restricted</Typography>
					<Typography variant="body1" align="center">Please log in to access this page.</Typography>
					<Box display="flex" justifyContent="center" marginTop="20px">
						<Button variant="contained" color="primary" component={Link} to="/login">
							Go to Login
						</Button>
					</Box>
				</Paper>
			</Container>
		);
	}

	console.log("Selected Role: ", selectedRole);

	if (!selectedRole.includes("Administrator") && !selectedRole.includes("Contributor")) {
		return (
			<Container maxWidth="sm">
				<Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
					<Typography variant="h6" align="center">Access Restricted</Typography>
					<Typography variant="body1" align="center">You do not have the necessary permissions to submit a question.</Typography>
				</Paper>
			</Container>
		);
	}


	return (
		<div>
			< Navbar setquestions={setquestions} setDownloadlist={setDownloadList} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
			<Card sx={{ margin: 'auto', maxWidth: 600, padding: 2 }}>
				<CardContent>
					<Typography
						variant="h4"
						noWrap
						sx={{
							fontFamily: 'Roboto, sans-serif',
							fontWeight: 500,
							// letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
							textAlign: 'center',
						}}
					>
						Submit a Question
					</Typography>
					<Form token={token} />
				</CardContent>
			</Card>
		</div>
	);
}

export default AddToQueueSharption;