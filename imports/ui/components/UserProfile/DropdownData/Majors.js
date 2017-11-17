//Retrieves majors array - what we are currently using on our legacy site
// {
// 	"README": "Comments and additional info on this json list",
// 	"Source": "https://github.com/fivethirtyeight/data/tree/master/college-majors",
// 	"numOfMajors": "175"
// }

export function getMajorsArray() {  
    const majorsArray = [{
			"majorId": "1100",
			"value": "General Agriculture",
			"label": "General Agriculture",
			"category": "Agriculture & Natural Resources"
		}, {
			"majorId": "1101",
			"value": "Agriculture Production And Management",
			"label": "Agriculture Production And Management",
			"category": "Agriculture & Natural Resources"
		}, {
			"majorId": "1102",
			"value": "Agricultural Economics",
			"label": "Agricultural Economics",
			"category": "Agriculture & Natural Resources"
		}, {
			"majorId": "1103",
			"value": "Animal Sciences",
			"label": "Animal Sciences",
			"category": "Agriculture & Natural Resources"
		}, {
			"majorId": "1104",
			"value": "Food Science",
			"label": "Food Science",
			"category": "Agriculture & Natural Resources"
		}, {
			"majorId": "1105",
			"value": "Plant Science And Agronomy",
			"label": "Plant Science And Agronomy",
			"category": "Agriculture & Natural Resources"
		}, {
			"majorId": "1106",
			"value": "Soil Science",
			"label": "Soil Science",
			"category": "Agriculture & Natural Resources"
		}, {
			"majorId": "1199",
			"value": "Miscellaneous Agriculture",
			"label": "Miscellaneous Agriculture",
			"category": "Agriculture & Natural Resources"
		}, {
			"majorId": "1302",
			"value": "Forestry",
			"label": "Forestry",
			"category": "Agriculture & Natural Resources"
		}, {
			"majorId": "1303",
			"value": "Natural Resources Management",
			"label": "Natural Resources Management",
			"category": "Agriculture & Natural Resources"
		},{
			"majorId": "6000",
			"value": "Fine Arts",
			"label": "Fine Arts",
			"category": "Arts"
		}, {
			"majorId": "6001",
			"value": "Drama And Theater Arts",
			"label": "Drama And Theater Arts",
			"category": "Arts"
		}, {
			"majorId": "6002",
			"value": "Music",
			"label": "Music",
			"category": "Arts"
		}, {
			"majorId": "6003",
			"value": "Visual And Performing Arts",
			"label": "Visual And Performing Arts",
			"category": "Arts"
		}, {
			"majorId": "6004",
			"value": "Commercial Art And Graphic Design",
			"label": "Commercial Art And Graphic Design",
			"category": "Arts"
		}, {
			"majorId": "6005",
			"value": "Film Video And Photographic Arts",
			"label": "Film Video And Photographic Arts",
			"category": "Arts"
		}, {
			"majorId": "6007",
			"value": "Studio Arts",
			"label": "Studio Arts",
			"category": "Arts"
		}, {
			"majorId": "6099",
			"value": "Miscellaneous Fine Arts",
			"label": "Miscellaneous Fine Arts",
			"category": "Arts"
		},{
			"majorId": "1301",
			"value": "Environmental Science",
			"label": "Environmental Science",
			"category": "Biology & Life Science"
		}, {
			"majorId": "3600",
			"value": "Biology",
			"label": "Biology",
			"category": "Biology & Life Science"
		}, {
			"majorId": "3601",
			"value": "Biochemical Sciences",
			"label": "Biochemical Sciences",
			"category": "Biology & Life Science"
		}, {
			"majorId": "3602",
			"value": "Botany",
			"label": "Botany",
			"category": "Biology & Life Science"
		}, {
			"majorId": "3603",
			"value": "Molecular Biology",
			"label": "Molecular Biology",
			"category": "Biology & Life Science"
		}, {
			"majorId": "3604",
			"value": "Ecology",
			"label": "Ecology",
			"category": "Biology & Life Science"
		}, {
			"majorId": "3605",
			"value": "Genetics",
			"label": "Genetics",
			"category": "Biology & Life Science"
		}, {
			"majorId": "3606",
			"value": "Microbiology",
			"label": "Microbiology",
			"category": "Biology & Life Science"
		}, {
			"majorId": "3607",
			"value": "Pharmacology",
			"label": "Pharmacology",
			"category": "Biology & Life Science"
		}, {
			"majorId": "3608",
			"value": "Physiology",
			"label": "Physiology",
			"category": "Biology & Life Science"
		}, {
			"majorId": "3609",
			"value": "Zoology",
			"label": "Zoology",
			"category": "Biology & Life Science"
		}, {
			"majorId": "3611",
			"value": "Neuroscience",
			"label": "Neuroscience",
			"category": "Biology & Life Science"
		}, {
			"majorId": "3699",
			"value": "Miscellaneous Biology",
			"label": "Miscellaneous Biology",
			"category": "Biology & Life Science"
		}, {
			"majorId": "4006",
			"value": "Cognitive Science And Biopsychology",
			"label": "Cognitive Science And Biopsychology",
			"category": "Biology & Life Science"
		},{
			"majorId": "6200",
			"value": "General Business",
			"label": "General Business",
			"category": "Business"
		}, {
			"majorId": "6201",
			"value": "Accounting",
			"label": "Accounting",
			"category": "Business"
		}, {
			"majorId": "6202",
			"value": "Actuarial Science",
			"label": "Actuarial Science",
			"category": "Business"
		}, {
			"majorId": "6203",
			"value": "Business Management And Administration",
			"label": "Business Management And Administration",
			"category": "Business"
		}, {
			"majorId": "6204",
			"value": "Operations Logistics And E-Commerce",
			"label": "Operations Logistics And E-Commerce",
			"category": "Business"
		}, {
			"majorId": "6205",
			"value": "Business Economics",
			"label": "Business Economics",
			"category": "Business"
		}, {
			"majorId": "6206",
			"value": "Marketing And Marketing Research",
			"label": "Marketing And Marketing Research",
			"category": "Business"
		}, {
			"majorId": "6207",
			"value": "Finance",
			"label": "Finance",
			"category": "Business"
		}, {
			"majorId": "6209",
			"value": "Human Resources And Personnel Management",
			"label": "Human Resources And Personnel Management",
			"category": "Business"
		}, {
			"majorId": "6210",
			"value": "International Business",
			"label": "International Business",
			"category": "Business"
		}, {
			"majorId": "6211",
			"value": "Hospitality Management",
			"label": "Hospitality Management",
			"category": "Business"
		}, {
			"majorId": "6212",
			"value": "Management Information Systems And Statistics",
			"label": "Management Information Systems And Statistics",
			"category": "Business"
		}, {
			"majorId": "6299",
			"value": "Miscellaneous Business & Medical Administration",
			"label": "Miscellaneous Business & Medical Administration",
			"category": "Business"
		},{
			"majorId": "1901",
			"value": "Communications",
			"label": "Communications",
			"category": "Communications & Journalism"
		}, {
			"majorId": "1902",
			"value": "Journalism",
			"label": "Journalism",
			"category": "Communications & Journalism"
		}, {
			"majorId": "1903",
			"value": "Mass Media",
			"label": "Mass Media",
			"category": "Communications & Journalism"
		}, {
			"majorId": "1904",
			"value": "Advertising And Public Relations",
			"label": "Advertising And Public Relations",
			"category": "Communications & Journalism"
		},{
			"majorId": "2001",
			"value": "Communication Technologies",
			"label": "Communication Technologies",
			"category": "Computers & Mathematics"
		}, {
			"majorId": "2100",
			"value": "Computer And Information Systems",
			"label": "Computer And Information Systems",
			"category": "Computers & Mathematics"
		}, {
			"majorId": "2101",
			"value": "Computer Programming And Data Processing",
			"label": "Computer Programming And Data Processing",
			"category": "Computers & Mathematics"
		}, {
			"majorId": "2102",
			"value": "Computer Science",
			"label": "Computer Science",
			"category": "Computers & Mathematics"
		}, {
			"majorId": "2105",
			"value": "Information Sciences",
			"label": "Information Sciences",
			"category": "Computers & Mathematics"
		}, {
			"majorId": "2106",
			"value": "Computer Administration Management And Security",
			"label": "Computer Administration Management And Security",
			"category": "Computers & Mathematics"
		}, {
			"majorId": "2107",
			"value": "Computer Networking And Telecommunications",
			"label": "Computer Networking And Telecommunications",
			"category": "Computers & Mathematics"
		}, {
			"majorId": "3700",
			"value": "Mathematics",
			"label": "Mathematics",
			"category": "Computers & Mathematics"
		}, {
			"majorId": "3701",
			"value": "Applied Mathematics",
			"label": "Applied Mathematics",
			"category": "Computers & Mathematics"
		}, {
			"majorId": "3702",
			"value": "Statistics And Decision Science",
			"label": "Statistics And Decision Science",
			"category": "Computers & Mathematics"
		}, {
			"majorId": "4005",
			"value": "Mathematics And Computer Science",
			"label": "Mathematics And Computer Science",
			"category": "Computers & Mathematics"
		},{
			"majorId": "2300",
			"value": "General Education",
			"label": "General Education",
			"category": "Education"
		}, {
			"majorId": "2301",
			"value": "Educational Administration And Supervision",
			"label": "Educational Administration And Supervision",
			"category": "Education"
		}, {
			"majorId": "2303",
			"value": "School Student Counseling",
			"label": "School Student Counseling",
			"category": "Education"
		}, {
			"majorId": "2304",
			"value": "Elementary Education",
			"label": "Elementary Education",
			"category": "Education"
		}, {
			"majorId": "2305",
			"value": "Mathematics Teacher Education",
			"label": "Mathematics Teacher Education",
			"category": "Education"
		}, {
			"majorId": "2306",
			"value": "Physical And Health Education Teaching",
			"label": "Physical And Health Education Teaching",
			"category": "Education"
		}, {
			"majorId": "2307",
			"value": "Early Childhood Education",
			"label": "Early Childhood Education",
			"category": "Education"
		}, {
			"majorId": "2308",
			"value": "Science And Computer Teacher Education",
			"label": "Science And Computer Teacher Education",
			"category": "Education"
		}, {
			"majorId": "2309",
			"value": "Secondary Teacher Education",
			"label": "Secondary Teacher Education",
			"category": "Education"
		}, {
			"majorId": "2310",
			"value": "Special Needs Education",
			"label": "Special Needs Education",
			"category": "Education"
		}, {
			"majorId": "2311",
			"value": "Social Science Or History Teacher Education",
			"label": "Social Science Or History Teacher Education",
			"category": "Education"
		}, {
			"majorId": "2312",
			"value": "Teacher Education: Multiple Levels",
			"label": "Teacher Education: Multiple Levels",
			"category": "Education"
		}, {
			"majorId": "2313",
			"value": "Language And Drama Education",
			"label": "Language And Drama Education",
			"category": "Education"
		}, {
			"majorId": "2314",
			"value": "Art And Music Education",
			"label": "Art And Music Education",
			"category": "Education"
		}, {
			"majorId": "2399",
			"value": "Miscellaneous Education",
			"label": "Miscellaneous Education",
			"category": "Education"
		}, {
			"majorId": "3501",
			"value": "Library Science",
			"label": "Library Science",
			"category": "Education"
		},{
			"majorId": "1401",
			"value": "Architecture",
			"label": "Architecture",
			"category": "Engineering"
		}, {
			"majorId": "2400",
			"value": "General Engineering",
			"label": "General Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2401",
			"value": "Aerospace Engineering",
			"label": "Aerospace Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2402",
			"value": "Biological Engineering",
			"label": "Biological Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2403",
			"value": "Architectural Engineering",
			"label": "Architectural Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2404",
			"value": "Biomedical Engineering",
			"label": "Biomedical Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2405",
			"value": "Chemical Engineering",
			"label": "Chemical Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2406",
			"value": "Civil Engineering",
			"label": "Civil Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2407",
			"value": "Computer Engineering",
			"label": "Computer Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2408",
			"value": "Electrical Engineering",
			"label": "Electrical Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2409",
			"value": "Engineering Mechanics Physics And Science",
			"label": "Engineering Mechanics Physics And Science",
			"category": "Engineering"
		}, {
			"majorId": "2410",
			"value": "Environmental Engineering",
			"label": "Environmental Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2411",
			"value": "Geological And Geophysical Engineering",
			"label": "Geological And Geophysical Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2412",
			"value": "Industrial And Manufacturing Engineering",
			"label": "Industrial And Manufacturing Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2413",
			"value": "Materials Engineering And Materials Science",
			"label": "Materials Engineering And Materials Science",
			"category": "Engineering"
		}, {
			"majorId": "2414",
			"value": "Mechanical Engineering",
			"label": "Mechanical Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2415",
			"value": "Metallurgical Engineering",
			"label": "Metallurgical Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2416",
			"value": "Mining And Mineral Engineering",
			"label": "Mining And Mineral Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2417",
			"value": "Naval Architecture And Marine Engineering",
			"label": "Naval Architecture And Marine Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2418",
			"value": "Nuclear Engineering",
			"label": "Nuclear Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2419",
			"value": "Petroleum Engineering",
			"label": "Petroleum Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2499",
			"value": "Miscellaneous Engineering",
			"label": "Miscellaneous Engineering",
			"category": "Engineering"
		}, {
			"majorId": "2500",
			"value": "Engineering Technologies",
			"label": "Engineering Technologies",
			"category": "Engineering"
		}, {
			"majorId": "2501",
			"value": "Engineering And Industrial Management",
			"label": "Engineering And Industrial Management",
			"category": "Engineering"
		}, {
			"majorId": "2502",
			"value": "Electrical Engineering Technology",
			"label": "Electrical Engineering Technology",
			"category": "Engineering"
		}, {
			"majorId": "2503",
			"value": "Industrial Production Technologies",
			"label": "Industrial Production Technologies",
			"category": "Engineering"
		}, {
			"majorId": "2504",
			"value": "Mechanical Engineering Related Technologies",
			"label": "Mechanical Engineering Related Technologies",
			"category": "Engineering"
		}, {
			"majorId": "2599",
			"value": "Miscellaneous Engineering Technologies",
			"label": "Miscellaneous Engineering Technologies",
			"category": "Engineering"
		}, {
			"majorId": "5008",
			"value": "Materials Science",
			"label": "Materials Science",
			"category": "Engineering"
		},{
			"majorId": "4002",
			"value": "Nutrition Sciences",
			"label": "Nutrition Sciences",
			"category": "Health"
		}, {
			"majorId": "6100",
			"value": "General Medical And Health Services",
			"label": "General Medical And Health Services",
			"category": "Health"
		}, {
			"majorId": "6102",
			"value": "Communication Disorders Sciences And Services",
			"label": "Communication Disorders Sciences And Services",
			"category": "Health"
		}, {
			"majorId": "6103",
			"value": "Health And Medical Administrative Services",
			"label": "Health And Medical Administrative Services",
			"category": "Health"
		}, {
			"majorId": "6104",
			"value": "Medical Assisting Services",
			"label": "Medical Assisting Services",
			"category": "Health"
		}, {
			"majorId": "6105",
			"value": "Medical Technologies Technicians",
			"label": "Medical Technologies Technicians",
			"category": "Health"
		}, {
			"majorId": "6106",
			"value": "Health And Medical Preparatory Programs",
			"label": "Health And Medical Preparatory Programs",
			"category": "Health"
		}, {
			"majorId": "6107",
			"value": "Nursing",
			"label": "Nursing",
			"category": "Health"
		}, {
			"majorId": "6108",
			"value": "Pharmacy Pharmaceutical Sciences And Administration",
			"label": "Pharmacy Pharmaceutical Sciences And Administration",
			"category": "Health"
		}, {
			"majorId": "6109",
			"value": "Treatment Therapy Professions",
			"label": "Treatment Therapy Professions",
			"category": "Health"
		}, {
			"majorId": "6110",
			"value": "Community And Public Health",
			"label": "Community And Public Health",
			"category": "Health"
		}, {
			"majorId": "6199",
			"value": "Miscellaneous Health Medical Professions",
			"label": "Miscellaneous Health Medical Professions",
			"category": "Health"
		},{
			"majorId": "1501",
			"value": "Area Ethnic And Civilization Studies",
			"label": "Area Ethnic And Civilization Studies",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "2601",
			"value": "Linguistics And Comparative Language And Literature",
			"label": "Linguistics And Comparative Language And Literature",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "2602",
			"value": "French German Latin And Other Common Foreign Language Studies",
			"label": "French German Latin And Other Common Foreign Language Studies",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "2603",
			"value": "Other Foreign Languages",
			"label": "Other Foreign Languages",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "3301",
			"value": "English Language And Literature",
			"label": "English Language And Literature",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "3302",
			"value": "Composition And Rhetoric",
			"label": "Composition And Rhetoric",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "3401",
			"value": "Liberal Arts",
			"label": "Liberal Arts",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "3402",
			"value": "Humanities",
			"label": "Humanities",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "4001",
			"value": "Intercultural And International Studies",
			"label": "Intercultural And International Studies",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "4801",
			"value": "Philosophy And Religious Studies",
			"label": "Philosophy And Religious Studies",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "4901",
			"value": "Theology And Religious Vocations",
			"label": "Theology And Religious Vocations",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "5502",
			"value": "Anthropology And Archeology",
			"label": "Anthropology And Archeology",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "6006",
			"value": "Art History And Criticism",
			"label": "Art History And Criticism",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "6402",
			"value": "History",
			"label": "History",
			"category": "Humanities & Liberal Arts"
		}, {
			"majorId": "6403",
			"value": "United States History",
			"label": "United States History",
			"category": "Humanities & Liberal Arts"
		},{
			"majorId": "2201",
			"value": "Cosmetology Services And Culinary Arts",
			"label": "Cosmetology Services And Culinary Arts",
			"category": "Industrial Arts & Consumer Services"
		}, {
			"majorId": "2901",
			"value": "Family And Consumer Sciences",
			"label": "Family And Consumer Sciences",
			"category": "Industrial Arts & Consumer Services"
		}, {
			"majorId": "3801",
			"value": "Military Technologies",
			"label": "Military Technologies",
			"category": "Industrial Arts & Consumer Services"
		}, {
			"majorId": "4101",
			"value": "Physical Fitness Parks Recreation And Leisure",
			"label": "Physical Fitness Parks Recreation And Leisure",
			"category": "Industrial Arts & Consumer Services"
		}, {
			"majorId": "5601",
			"value": "Construction Services",
			"label": "Construction Services",
			"category": "Industrial Arts & Consumer Services"
		}, {
			"majorId": "5701",
			"value": "Electrical, Mechanical, And Precision Technologies And Production",
			"label": "Electrical, Mechanical, And Precision Technologies And Production",
			"category": "Industrial Arts & Consumer Services"
		}, {
			"majorId": "5901",
			"value": "Transportation Sciences And Technologies",
			"label": "Transportation Sciences And Technologies",
			"category": "Industrial Arts & Consumer Services"
		},{
			"majorId": "4000",
			"value": "Multi/Interdisciplinary Studies",
			"label": "Multi/Interdisciplinary Studies",
			"category": "Interdisciplinary"
		},{
			"majorId": "3201",
			"value": "Court Reporting",
			"label": "Court Reporting",
			"category": "Law & Public Policy"
		}, {
			"majorId": "3202",
			"value": "Pre-Law And Legal Studies",
			"label": "Pre-Law And Legal Studies",
			"category": "Law & Public Policy"
		}, {
			"majorId": "5301",
			"value": "Criminal Justice And Fire Protection",
			"label": "Criminal Justice And Fire Protection",
			"category": "Law & Public Policy"
		}, {
			"majorId": "5401",
			"value": "Public Administration",
			"label": "Public Administration",
			"category": "Law & Public Policy"
		}, {
			"majorId": "5402",
			"value": "Public Policy",
			"label": "Public Policy",
			"category": "Law & Public Policy"
		},{
			"majorId": "7000",
			"value": "Not Applicable",
			"label": "Not Applicable - No Major",
			"category": "Other"
		}, {
			"majorId": "1000",
			"value": "None",
			"label": "None",
			"category": "Other"
		},{
			"majorId": "5000",
			"value": "Physical Sciences",
			"label": "Physical Sciences",
			"category": "Physical Sciences"
		}, {
			"majorId": "5001",
			"value": "Astronomy And Astrophysics",
			"label": "Astronomy And Astrophysics",
			"category": "Physical Sciences"
		}, {
			"majorId": "5002",
			"value": "Atmospheric Sciences And Meteorology",
			"label": "Atmospheric Sciences And Meteorology",
			"category": "Physical Sciences"
		}, {
			"majorId": "5003",
			"value": "Chemistry",
			"label": "Chemistry",
			"category": "Physical Sciences"
		}, {
			"majorId": "5004",
			"value": "Geology And Earth Science",
			"label": "Geology And Earth Science",
			"category": "Physical Sciences"
		}, {
			"majorId": "5005",
			"value": "Geosciences",
			"label": "Geosciences",
			"category": "Physical Sciences"
		}, {
			"majorId": "5006",
			"value": "Oceanography",
			"label": "Oceanography",
			"category": "Physical Sciences"
		}, {
			"majorId": "5007",
			"value": "Physics",
			"label": "Physics",
			"category": "Physical Sciences"
		}, {
			"majorId": "5098",
			"value": "Multi-Disciplinary Or General Science",
			"label": "Multi-Disciplinary Or General Science",
			"category": "Physical Sciences"
		}, {
			"majorId": "5102",
			"value": "Nuclear, Industrial Radiology, And Biological Technologies",
			"label": "Nuclear, Industrial Radiology, And Biological Technologies",
			"category": "Physical Sciences"
		},{
			"majorId": "5200",
			"value": "Psychology",
			"label": "Psychology",
			"category": "Psychology & Social Work"
		}, {
			"majorId": "5201",
			"value": "Educational Psychology",
			"label": "Educational Psychology",
			"category": "Psychology & Social Work"
		}, {
			"majorId": "5202",
			"value": "Clinical Psychology",
			"label": "Clinical Psychology",
			"category": "Psychology & Social Work"
		}, {
			"majorId": "5203",
			"value": "Counseling Psychology",
			"label": "Counseling Psychology",
			"category": "Psychology & Social Work"
		}, {
			"majorId": "5205",
			"value": "Industrial And Organizational Psychology",
			"label": "Industrial And Organizational Psychology",
			"category": "Psychology & Social Work"
		}, {
			"majorId": "5206",
			"value": "Social Psychology",
			"label": "Social Psychology",
			"category": "Psychology & Social Work"
		}, {
			"majorId": "5299",
			"value": "Miscellaneous Psychology",
			"label": "Miscellaneous Psychology",
			"category": "Psychology & Social Work"
		}, {
			"majorId": "5403",
			"value": "Human Services And Community Organization",
			"label": "Human Services And Community Organization",
			"category": "Psychology & Social Work"
		}, {
			"majorId": "5404",
			"value": "Social Work",
			"label": "Social Work",
			"category": "Psychology & Social Work"
		},{
			"majorId": "4007",
			"value": "Interdisciplinary Social Sciences",
			"label": "Interdisciplinary Social Sciences",
			"category": "Social Science"
		}, {
			"majorId": "5500",
			"value": "General Social Sciences",
			"label": "General Social Sciences",
			"category": "Social Science"
		}, {
			"majorId": "5501",
			"value": "Economics",
			"label": "Economics",
			"category": "Social Science"
		}, {
			"majorId": "5503",
			"value": "Criminology",
			"label": "Criminology",
			"category": "Social Science"
		}, {
			"majorId": "5504",
			"value": "Geography",
			"label": "Geography",
			"category": "Social Science"
		}, {
			"majorId": "5505",
			"value": "International Relations",
			"label": "International Relations",
			"category": "Social Science"
		}, {
			"majorId": "5506",
			"value": "Political Science And Government",
			"label": "Political Science And Government",
			"category": "Social Science"
		}, {
			"majorId": "5507",
			"value": "Sociology",
			"label": "Sociology",
			"category": "Social Science"
		}, {
			"majorId": "5599",
			"value": "Miscellaneous Social Sciences",
			"label": "Miscellaneous Social Sciences",
			"category": "Social Science"
		}
	]
    return majorsArray;
}





