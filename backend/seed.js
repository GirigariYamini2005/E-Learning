const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

const courses = [
  {
    title: 'Introduction to Python Programming',
    description: 'Learn Python from scratch. This course covers fundamental concepts including variables, data types, control flow, functions, and object-oriented programming.',
    category: 'Programming',
    difficulty: 'Beginner',
    thumbnail: '🐍',
    topics: [
      {
        title: 'Python Basics',
        description: 'Getting started with Python programming',
        order: 0,
        subtopics: [
          {
            title: 'Variables and Data Types',
            order: 0,
            content: `# Variables and Data Types in Python

## What are Variables?
Variables are containers for storing data values. In Python, you don't need to declare the type of a variable — Python figures it out automatically.

## Creating Variables
\`\`\`python
name = "Alice"      # String
age = 25             # Integer
height = 5.6         # Float
is_student = True    # Boolean
\`\`\`

## Data Types
Python has several built-in data types:

| Type | Example | Description |
|------|---------|-------------|
| str | "Hello" | Text/String |
| int | 42 | Whole numbers |
| float | 3.14 | Decimal numbers |
| bool | True/False | Boolean values |
| list | [1, 2, 3] | Ordered, mutable collection |
| dict | {"key": "value"} | Key-value pairs |

## Type Checking
\`\`\`python
x = 10
print(type(x))  # <class 'int'>

y = "Hello"
print(type(y))  # <class 'str'>
\`\`\`

## Type Conversion
\`\`\`python
# Converting between types
num_str = "42"
num_int = int(num_str)   # String to Integer
num_float = float(num_str)  # String to Float

age = 25
age_str = str(age)  # Integer to String
\`\`\`

## Key Points
- Variables don't need explicit type declarations
- Python is dynamically typed
- Use meaningful variable names
- Variable names are case-sensitive`
          },
          {
            title: 'Operators and Expressions',
            order: 1,
            content: `# Operators and Expressions

## Arithmetic Operators
\`\`\`python
a = 10
b = 3

print(a + b)   # Addition: 13
print(a - b)   # Subtraction: 7
print(a * b)   # Multiplication: 30
print(a / b)   # Division: 3.333...
print(a // b)  # Floor Division: 3
print(a % b)   # Modulus: 1
print(a ** b)  # Exponentiation: 1000
\`\`\`

## Comparison Operators
\`\`\`python
x = 5
y = 10

print(x == y)   # Equal to: False
print(x != y)   # Not equal to: True
print(x > y)    # Greater than: False
print(x < y)    # Less than: True
print(x >= y)   # Greater or equal: False
print(x <= y)   # Less or equal: True
\`\`\`

## Logical Operators
\`\`\`python
a = True
b = False

print(a and b)  # False
print(a or b)   # True
print(not a)    # False
\`\`\`

## Assignment Operators
\`\`\`python
x = 10
x += 5   # x = x + 5 → 15
x -= 3   # x = x - 3 → 12
x *= 2   # x = x * 2 → 24
x /= 4   # x = x / 4 → 6.0
\`\`\`

## Key Points
- Python follows standard mathematical order of operations (PEMDAS)
- Use parentheses to clarify complex expressions
- The // operator performs integer (floor) division`
          }
        ]
      },
      {
        title: 'Control Flow',
        description: 'Decision making and loops in Python',
        order: 1,
        subtopics: [
          {
            title: 'Conditional Statements',
            order: 0,
            content: `# Conditional Statements (if/elif/else)

## The if Statement
Conditional statements allow your program to make decisions.

\`\`\`python
age = 18

if age >= 18:
    print("You are an adult")
\`\`\`

## if-else Statement
\`\`\`python
temperature = 30

if temperature > 25:
    print("It's hot outside!")
else:
    print("It's cool outside!")
\`\`\`

## if-elif-else Statement
\`\`\`python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is: {grade}")  # Output: Your grade is: B
\`\`\`

## Nested Conditions
\`\`\`python
age = 25
has_license = True

if age >= 18:
    if has_license:
        print("You can drive!")
    else:
        print("Get a license first!")
else:
    print("Too young to drive")
\`\`\`

## Ternary Operator
\`\`\`python
age = 20
status = "adult" if age >= 18 else "minor"
print(status)  # Output: adult
\`\`\`

## Key Points
- Python uses indentation to define code blocks
- elif is short for "else if"
- You can nest conditions inside each other
- The ternary operator provides a shorthand for simple if-else`
          },
          {
            title: 'Loops',
            order: 1,
            content: `# Loops in Python

## For Loop
The for loop iterates over a sequence (list, string, range, etc.)

\`\`\`python
# Iterating over a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Using range()
for i in range(5):
    print(i)  # Prints 0, 1, 2, 3, 4

# Range with start and step
for i in range(2, 10, 2):
    print(i)  # Prints 2, 4, 6, 8
\`\`\`

## While Loop
The while loop repeats as long as a condition is True.

\`\`\`python
count = 0
while count < 5:
    print(f"Count is: {count}")
    count += 1
\`\`\`

## Break and Continue
\`\`\`python
# break - exit the loop
for i in range(10):
    if i == 5:
        break
    print(i)  # Prints 0, 1, 2, 3, 4

# continue - skip current iteration
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)  # Prints 1, 3, 5, 7, 9
\`\`\`

## Nested Loops
\`\`\`python
for i in range(3):
    for j in range(3):
        print(f"({i}, {j})", end=" ")
    print()
\`\`\`

## List Comprehension
\`\`\`python
squares = [x**2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

evens = [x for x in range(20) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
\`\`\`

## Key Points
- for loops are best when you know the number of iterations
- while loops are best when the condition is dynamic
- Always ensure while loops have an exit condition to avoid infinite loops`
          }
        ]
      },
      {
        title: 'Functions',
        description: 'Reusable blocks of code',
        order: 2,
        subtopics: [
          {
            title: 'Defining and Calling Functions',
            order: 0,
            content: `# Functions in Python

## What is a Function?
A function is a reusable block of code that performs a specific task.

## Defining a Function
\`\`\`python
def greet(name):
    return f"Hello, {name}!"

message = greet("Alice")
print(message)  # Output: Hello, Alice!
\`\`\`

## Parameters and Arguments
\`\`\`python
# Default parameters
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Bob"))              # Hello, Bob!
print(greet("Bob", "Hi"))        # Hi, Bob!

# Keyword arguments
def describe_pet(name, animal_type="dog"):
    print(f"I have a {animal_type} named {name}")

describe_pet(name="Max")
describe_pet(name="Whiskers", animal_type="cat")
\`\`\`

## Return Values
\`\`\`python
def add(a, b):
    return a + b

result = add(3, 5)
print(result)  # 8

# Multiple return values
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers) / len(numbers)

minimum, maximum, average = get_stats([10, 20, 30, 40])
\`\`\`

## Variable Scope
\`\`\`python
x = 10  # Global variable

def my_function():
    y = 5  # Local variable
    print(x)  # Can access global
    print(y)  # Can access local

my_function()
# print(y)  # Error! y is not accessible outside the function
\`\`\`

## *args and **kwargs
\`\`\`python
def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3, 4))  # 10

def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="NYC")
\`\`\`

## Key Points
- Functions promote code reuse and organization
- Use descriptive function names
- Keep functions focused on a single task
- Document complex functions with docstrings`
          }
        ]
      }
    ]
  },
  {
    title: 'Web Development with JavaScript',
    description: 'Master JavaScript for web development. Learn DOM manipulation, events, async programming, and modern ES6+ features.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    thumbnail: '🌐',
    topics: [
      {
        title: 'JavaScript Fundamentals',
        description: 'Core JavaScript concepts',
        order: 0,
        subtopics: [
          {
            title: 'Variables and Scope',
            order: 0,
            content: `# Variables and Scope in JavaScript

## Declaring Variables
JavaScript has three ways to declare variables:

\`\`\`javascript
var oldWay = "I'm function-scoped";  // Older way (avoid)
let modern = "I'm block-scoped";      // Preferred for mutable values
const constant = "I can't be reassigned";  // For constants
\`\`\`

## let vs const vs var
| Feature | var | let | const |
|---------|-----|-----|-------|
| Scope | Function | Block | Block |
| Hoisting | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |
| Reassignment | Yes | Yes | No |
| Redeclaration | Yes | No | No |

## Block Scope
\`\`\`javascript
if (true) {
    let x = 10;
    const y = 20;
    var z = 30;
}
// console.log(x);  // Error! x is not defined
// console.log(y);  // Error! y is not defined
console.log(z);     // 30 (var is function-scoped)
\`\`\`

## Data Types
\`\`\`javascript
// Primitive Types
let str = "Hello";          // String
let num = 42;               // Number
let bool = true;            // Boolean
let nothing = null;         // Null
let notDefined = undefined; // Undefined
let sym = Symbol("id");     // Symbol
let big = 9007199254740991n; // BigInt

// Reference Types
let arr = [1, 2, 3];              // Array
let obj = { name: "Alice" };      // Object
let func = function() {};          // Function
\`\`\`

## Template Literals
\`\`\`javascript
const name = "Alice";
const age = 25;
console.log(\`My name is \${name} and I'm \${age} years old.\`);
\`\`\`

## Key Points
- Always prefer const, use let when reassignment is needed
- Avoid var in modern JavaScript
- Understand the Temporal Dead Zone (TDZ) for let/const`
          },
          {
            title: 'Functions and Arrow Functions',
            order: 1,
            content: `# Functions and Arrow Functions

## Function Declaration
\`\`\`javascript
function greet(name) {
    return \`Hello, \${name}!\`;
}
\`\`\`

## Function Expression
\`\`\`javascript
const greet = function(name) {
    return \`Hello, \${name}!\`;
};
\`\`\`

## Arrow Functions (ES6+)
\`\`\`javascript
// Full syntax
const add = (a, b) => {
    return a + b;
};

// Short syntax (implicit return)
const multiply = (a, b) => a * b;

// Single parameter (no parentheses needed)
const double = x => x * 2;

// No parameters
const sayHi = () => "Hi!";
\`\`\`

## Higher-Order Functions
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// filter - keep elements that pass a test
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]

// reduce - accumulate values
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 15
\`\`\`

## Closures
\`\`\`javascript
function counter() {
    let count = 0;
    return {
        increment: () => ++count,
        getCount: () => count
    };
}

const myCounter = counter();
myCounter.increment();
myCounter.increment();
console.log(myCounter.getCount()); // 2
\`\`\`

## Key Points
- Arrow functions don't have their own 'this'
- Use arrow functions for callbacks and short functions
- Higher-order functions are fundamental to functional JS
- Closures allow functions to remember their scope`
          }
        ]
      },
      {
        title: 'DOM Manipulation',
        description: 'Interacting with web pages',
        order: 1,
        subtopics: [
          {
            title: 'Selecting and Modifying Elements',
            order: 0,
            content: `# DOM Manipulation

## Selecting Elements
\`\`\`javascript
// By ID
const header = document.getElementById('header');

// By class name
const items = document.getElementsByClassName('item');

// By CSS selector (returns first match)
const firstBtn = document.querySelector('.btn');

// All matching elements
const allBtns = document.querySelectorAll('.btn');
\`\`\`

## Modifying Content
\`\`\`javascript
const element = document.querySelector('#title');

// Change text content
element.textContent = 'New Title';

// Change HTML content
element.innerHTML = '<strong>Bold Title</strong>';
\`\`\`

## Modifying Styles
\`\`\`javascript
const box = document.querySelector('.box');

// Individual styles
box.style.backgroundColor = 'blue';
box.style.padding = '20px';
box.style.borderRadius = '8px';

// Adding/removing CSS classes
box.classList.add('active');
box.classList.remove('hidden');
box.classList.toggle('highlight');
\`\`\`

## Creating and Removing Elements
\`\`\`javascript
// Create new element
const newDiv = document.createElement('div');
newDiv.textContent = 'I am new!';
newDiv.classList.add('card');

// Append to parent
document.body.appendChild(newDiv);

// Remove element
newDiv.remove();
\`\`\`

## Event Listeners
\`\`\`javascript
const button = document.querySelector('#myBtn');

button.addEventListener('click', (event) => {
    console.log('Button clicked!');
    event.target.style.backgroundColor = 'green';
});

// Common events: click, submit, keydown, mouseover, change, load
\`\`\`

## Key Points
- querySelector is the most versatile selector
- Prefer classList over direct style manipulation
- Always remove event listeners when no longer needed
- Use event delegation for dynamic elements`
          }
        ]
      }
    ]
  },
  {
    title: 'Data Science Fundamentals',
    description: 'Introduction to data science concepts including statistics, data analysis, and machine learning basics using Python.',
    category: 'Data Science',
    difficulty: 'Intermediate',
    thumbnail: '📊',
    topics: [
      {
        title: 'Statistics Basics',
        description: 'Fundamental statistical concepts',
        order: 0,
        subtopics: [
          {
            title: 'Descriptive Statistics',
            order: 0,
            content: `# Descriptive Statistics

## What is Descriptive Statistics?
Descriptive statistics summarize and describe the main features of a dataset.

## Measures of Central Tendency

### Mean (Average)
The sum of all values divided by the number of values.
\`\`\`python
import numpy as np

data = [85, 90, 78, 92, 88]
mean = np.mean(data)
print(f"Mean: {mean}")  # Mean: 86.6
\`\`\`

### Median
The middle value when data is sorted.
\`\`\`python
median = np.median(data)
print(f"Median: {median}")  # Median: 88.0
\`\`\`

### Mode
The most frequently occurring value.
\`\`\`python
from scipy import stats
data = [1, 2, 2, 3, 3, 3, 4]
mode = stats.mode(data)
print(f"Mode: {mode.mode}")  # Mode: 3
\`\`\`

## Measures of Spread

### Range
\`\`\`python
data_range = max(data) - min(data)
\`\`\`

### Variance
Average of squared deviations from the mean.
\`\`\`python
variance = np.var(data)
\`\`\`

### Standard Deviation
Square root of variance — measures how spread out values are.
\`\`\`python
std_dev = np.std(data)
\`\`\`

## Percentiles and Quartiles
\`\`\`python
data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

Q1 = np.percentile(data, 25)  # 25th percentile
Q2 = np.percentile(data, 50)  # Median
Q3 = np.percentile(data, 75)  # 75th percentile
IQR = Q3 - Q1  # Interquartile Range
\`\`\`

## Key Points
- Mean is sensitive to outliers; median is more robust
- Standard deviation tells you how much data varies from the mean
- Use multiple measures together for a complete picture`
          },
          {
            title: 'Probability Basics',
            order: 1,
            content: `# Probability Basics

## What is Probability?
Probability measures the likelihood of an event occurring, expressed as a number between 0 (impossible) and 1 (certain).

## Basic Probability Formula
$$P(A) = \\frac{\\text{Number of favorable outcomes}}{\\text{Total number of outcomes}}$$

## Example
\`\`\`python
# Rolling a die - probability of getting a 4
favorable = 1
total = 6
prob = favorable / total
print(f"P(4) = {prob:.4f}")  # 0.1667
\`\`\`

## Types of Probability
1. **Classical**: Based on equally likely outcomes
2. **Empirical**: Based on observations/experiments
3. **Subjective**: Based on personal judgment

## Probability Rules

### Addition Rule (OR)
$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$

For mutually exclusive events:
$$P(A \\cup B) = P(A) + P(B)$$

### Multiplication Rule (AND)
$$P(A \\cap B) = P(A) \\times P(B|A)$$

For independent events:
$$P(A \\cap B) = P(A) \\times P(B)$$

## Conditional Probability
$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}$$

\`\`\`python
# Example: Drawing cards
# P(King | Face Card)
p_king_and_face = 4/52
p_face = 12/52
p_king_given_face = p_king_and_face / p_face
print(f"P(King|Face) = {p_king_given_face:.4f}")  # 0.3333
\`\`\`

## Key Points
- Probabilities always range from 0 to 1
- The sum of all possible outcomes equals 1
- Independent events don't affect each other's probability
- Conditional probability accounts for prior knowledge`
          }
        ]
      },
      {
        title: 'Data Analysis with Python',
        description: 'Using Python libraries for data analysis',
        order: 1,
        subtopics: [
          {
            title: 'Introduction to Pandas',
            order: 0,
            content: `# Introduction to Pandas

## What is Pandas?
Pandas is a Python library for data manipulation and analysis. It provides data structures like DataFrame and Series.

## Creating DataFrames
\`\`\`python
import pandas as pd

# From dictionary
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'Diana'],
    'Age': [25, 30, 35, 28],
    'Score': [85, 92, 78, 95]
}
df = pd.DataFrame(data)
print(df)
\`\`\`

## Reading Data
\`\`\`python
# From CSV
df = pd.read_csv('data.csv')

# From Excel
df = pd.read_excel('data.xlsx')

# From JSON
df = pd.read_json('data.json')
\`\`\`

## Basic Operations
\`\`\`python
# View first/last rows
df.head()
df.tail()

# Data info
df.info()
df.describe()  # Statistical summary
df.shape       # (rows, columns)

# Select columns
ages = df['Age']
subset = df[['Name', 'Score']]

# Filter rows
adults = df[df['Age'] >= 18]
high_scorers = df[df['Score'] > 90]
\`\`\`

## Data Cleaning
\`\`\`python
# Handle missing values
df.isnull().sum()          # Count missing values
df.dropna()                # Remove rows with missing values
df.fillna(0)               # Fill missing with 0
df.fillna(df.mean())       # Fill with column mean

# Remove duplicates
df.drop_duplicates()

# Rename columns
df.rename(columns={'old': 'new'}, inplace=True)
\`\`\`

## Grouping and Aggregation
\`\`\`python
# Group by category
grouped = df.groupby('Category')['Score'].mean()

# Multiple aggregations
stats = df.groupby('Category').agg({
    'Score': ['mean', 'max', 'min'],
    'Age': 'mean'
})
\`\`\`

## Key Points
- DataFrames are the primary data structure in Pandas
- Always explore your data before analysis (head, info, describe)
- Handle missing values appropriately for your use case
- Groupby operations are powerful for aggregate analysis`
          }
        ]
      }
    ]
  },
  {
    title: 'Database Management with MongoDB',
    description: 'Learn NoSQL database concepts with MongoDB. Covers CRUD operations, indexing, aggregation, and schema design.',
    category: 'Database',
    difficulty: 'Beginner',
    thumbnail: '🗄️',
    topics: [
      {
        title: 'MongoDB Basics',
        description: 'Getting started with MongoDB',
        order: 0,
        subtopics: [
          {
            title: 'Introduction to NoSQL and MongoDB',
            order: 0,
            content: `# Introduction to NoSQL and MongoDB

## What is NoSQL?
NoSQL (Not Only SQL) databases provide flexible schemas and are designed for specific data models. They are used for large-scale data storage and real-time applications.

## Types of NoSQL Databases
1. **Document Store** (MongoDB, CouchDB) — stores data as JSON-like documents
2. **Key-Value Store** (Redis, DynamoDB) — simple key-value pairs
3. **Column Family** (Cassandra, HBase) — stores data in columns
4. **Graph Database** (Neo4j) — stores relationships between data

## What is MongoDB?
MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like documents (BSON).

## Key Concepts
| SQL Term | MongoDB Term |
|----------|-------------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Primary Key | _id |

## Document Structure
\`\`\`json
{
    "_id": ObjectId("507f1f77bcf86cd799439011"),
    "name": "Alice",
    "age": 25,
    "email": "alice@example.com",
    "hobbies": ["reading", "coding"],
    "address": {
        "city": "New York",
        "zip": "10001"
    }
}
\`\`\`

## Advantages of MongoDB
- **Flexible Schema**: Documents in a collection can have different structures
- **Scalability**: Built-in support for horizontal scaling (sharding)
- **Performance**: Optimized for read/write operations
- **Rich Queries**: Supports complex queries, aggregation, and indexing

## Key Points
- MongoDB stores data as BSON (Binary JSON) documents
- Collections are schema-flexible — no need to define structure beforehand
- The _id field is automatically created as a unique identifier
- MongoDB is ideal for applications with evolving data models`
          },
          {
            title: 'CRUD Operations',
            order: 1,
            content: `# CRUD Operations in MongoDB

## Create (Insert)
\`\`\`javascript
// Insert one document
db.users.insertOne({
    name: "Alice",
    age: 25,
    email: "alice@example.com"
});

// Insert multiple documents
db.users.insertMany([
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 35 }
]);
\`\`\`

## Read (Find)
\`\`\`javascript
// Find all documents
db.users.find();

// Find with filter
db.users.find({ age: { $gt: 25 } });

// Find one document
db.users.findOne({ name: "Alice" });

// Projection (select specific fields)
db.users.find({}, { name: 1, email: 1, _id: 0 });

// Sorting
db.users.find().sort({ age: -1 });  // Descending

// Limit and Skip
db.users.find().limit(5).skip(10);
\`\`\`

## Update
\`\`\`javascript
// Update one document
db.users.updateOne(
    { name: "Alice" },
    { $set: { age: 26 } }
);

// Update multiple documents
db.users.updateMany(
    { age: { $lt: 30 } },
    { $set: { status: "young" } }
);

// Common update operators
// $set - set field value
// $inc - increment by value
// $push - add to array
// $pull - remove from array
// $unset - remove field

db.users.updateOne(
    { name: "Alice" },
    { $inc: { age: 1 }, $push: { hobbies: "gaming" } }
);
\`\`\`

## Delete
\`\`\`javascript
// Delete one document
db.users.deleteOne({ name: "Alice" });

// Delete multiple documents
db.users.deleteMany({ age: { $lt: 18 } });
\`\`\`

## Query Operators
| Operator | Description | Example |
|----------|-------------|---------|
| $eq | Equal | { age: { $eq: 25 } } |
| $gt | Greater than | { age: { $gt: 25 } } |
| $gte | Greater or equal | { age: { $gte: 25 } } |
| $lt | Less than | { age: { $lt: 25 } } |
| $in | In array | { status: { $in: ["A", "B"] } } |
| $and | Logical AND | { $and: [{}, {}] } |
| $or | Logical OR | { $or: [{}, {}] } |

## Key Points
- Always use specific filters to avoid unintended updates/deletes
- Use projection to limit returned fields and improve performance
- The $set operator only modifies specified fields
- MongoDB creates an _id if not provided`
          }
        ]
      }
    ]
  },
  {
    title: 'Machine Learning Basics',
    description: 'Introduction to machine learning concepts, algorithms, and practical applications using scikit-learn.',
    category: 'AI & Machine Learning',
    difficulty: 'Advanced',
    thumbnail: '🤖',
    topics: [
      {
        title: 'ML Fundamentals',
        description: 'Core machine learning concepts',
        order: 0,
        subtopics: [
          {
            title: 'Types of Machine Learning',
            order: 0,
            content: `# Types of Machine Learning

## What is Machine Learning?
Machine Learning (ML) is a subset of Artificial Intelligence that enables systems to learn and improve from experience without being explicitly programmed.

## Three Types of ML

### 1. Supervised Learning
The algorithm learns from labeled training data to make predictions.

**Examples:**
- **Classification**: Email spam detection, image recognition
- **Regression**: Price prediction, temperature forecasting

\`\`\`python
from sklearn.linear_model import LinearRegression

# Training data
X_train = [[1], [2], [3], [4], [5]]
y_train = [2, 4, 6, 8, 10]

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict
prediction = model.predict([[6]])
print(f"Prediction: {prediction[0]}")  # ~12
\`\`\`

### 2. Unsupervised Learning
The algorithm finds patterns in unlabeled data.

**Examples:**
- **Clustering**: Customer segmentation, grouping similar documents
- **Dimensionality Reduction**: Feature reduction, visualization

\`\`\`python
from sklearn.cluster import KMeans

data = [[1, 2], [1, 4], [1, 0], [10, 2], [10, 4], [10, 0]]
kmeans = KMeans(n_clusters=2, random_state=42)
kmeans.fit(data)
print(f"Clusters: {kmeans.labels_}")
\`\`\`

### 3. Reinforcement Learning
The algorithm learns by interacting with an environment and receiving rewards or penalties.

**Examples:**
- Game playing (Chess, Go)
- Robotics
- Self-driving cars

## Key ML Concepts

### Training vs Testing
- **Training Set**: Data used to train the model (typically 70-80%)
- **Testing Set**: Data used to evaluate the model (typically 20-30%)

### Overfitting vs Underfitting
- **Overfitting**: Model learns training data too well, performs poorly on new data
- **Underfitting**: Model is too simple to capture patterns in the data

### Bias-Variance Tradeoff
- **High Bias**: Underfitting — model is too simple
- **High Variance**: Overfitting — model is too complex
- Goal: Find the right balance

## Key Points
- Choose the type of ML based on your data and problem
- Always split data into training and testing sets
- Evaluate model performance on unseen data
- Start simple and increase complexity as needed`
          }
        ]
      }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Course.deleteMany({});
    await Quiz.deleteMany({});
    console.log('Cleared existing courses and quizzes');

    // Create admin user if doesn't exist
    let admin = await User.findOne({ email: 'admin@elearning.com' });
    if (!admin) {
      admin = new User({
        name: 'Admin',
        email: 'admin@elearning.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created (admin@elearning.com / admin123)');
    }

    // Insert courses
    const savedCourses = await Course.insertMany(courses.map(c => ({ ...c, createdBy: admin._id })));
    console.log(`Inserted ${savedCourses.length} courses`);

    // Create quizzes for each course's subtopics
    const quizzes = [];

    // Python - Variables and Data Types quiz
    quizzes.push({
      course: savedCourses[0]._id,
      topicIndex: 0,
      subtopicIndex: 0,
      title: 'Variables and Data Types Quiz',
      questions: [
        {
          question: 'Which of the following is NOT a valid Python data type?',
          options: ['int', 'float', 'char', 'str'],
          correctAnswer: 2,
          explanation: 'Python does not have a "char" data type. Single characters are represented as strings of length 1.'
        },
        {
          question: 'What is the output of type(3.14)?',
          options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'double'>"],
          correctAnswer: 1,
          explanation: '3.14 is a decimal number, so Python identifies it as a float type.'
        },
        {
          question: 'Which function is used to check the data type of a variable in Python?',
          options: ['typeof()', 'type()', 'datatype()', 'checktype()'],
          correctAnswer: 1,
          explanation: 'The type() function returns the data type of the given variable.'
        },
        {
          question: 'What will int("10.5") produce?',
          options: ['10', '10.5', 'Error', '11'],
          correctAnswer: 2,
          explanation: 'int() cannot convert a string with a decimal point directly. You need to use float() first, then int().'
        },
        {
          question: 'Python is a _____ typed language.',
          options: ['Statically', 'Dynamically', 'Strongly typed only', 'Weakly'],
          correctAnswer: 1,
          explanation: 'Python is dynamically typed, meaning you don\'t need to declare variable types explicitly.'
        }
      ]
    });

    // Python - Operators quiz
    quizzes.push({
      course: savedCourses[0]._id,
      topicIndex: 0,
      subtopicIndex: 1,
      title: 'Operators and Expressions Quiz',
      questions: [
        {
          question: 'What is the result of 17 // 5 in Python?',
          options: ['3.4', '3', '4', '2'],
          correctAnswer: 1,
          explanation: 'The // operator performs floor division, which returns the integer part of the quotient. 17 / 5 = 3.4, so floor is 3.'
        },
        {
          question: 'What is the result of 2 ** 3?',
          options: ['6', '8', '5', '16'],
          correctAnswer: 1,
          explanation: '** is the exponentiation operator. 2 ** 3 = 2³ = 8.'
        },
        {
          question: 'What does the % operator do?',
          options: ['Division', 'Percentage', 'Modulus (remainder)', 'Floor division'],
          correctAnswer: 2,
          explanation: 'The % operator returns the remainder of division. For example, 10 % 3 = 1.'
        },
        {
          question: 'What is the result of: True and False?',
          options: ['True', 'False', '1', 'Error'],
          correctAnswer: 1,
          explanation: 'The "and" operator returns True only if both operands are True. Since one is False, the result is False.'
        },
        {
          question: 'Which operator has the highest precedence?',
          options: ['+', '*', '**', '%'],
          correctAnswer: 2,
          explanation: 'Exponentiation (**) has the highest precedence among arithmetic operators in Python.'
        }
      ]
    });

    // Python - Conditional Statements quiz
    quizzes.push({
      course: savedCourses[0]._id,
      topicIndex: 1,
      subtopicIndex: 0,
      title: 'Conditional Statements Quiz',
      questions: [
        {
          question: 'What keyword is used for "else if" in Python?',
          options: ['else if', 'elseif', 'elif', 'elsif'],
          correctAnswer: 2,
          explanation: 'Python uses "elif" as a shorthand for "else if".'
        },
        {
          question: 'What defines a code block in Python?',
          options: ['Curly braces {}', 'Parentheses ()', 'Indentation', 'Square brackets []'],
          correctAnswer: 2,
          explanation: 'Python uses indentation (typically 4 spaces) to define code blocks, unlike languages that use braces.'
        },
        {
          question: 'What is the output of: "adult" if 20 >= 18 else "minor"?',
          options: ['"adult"', '"minor"', 'Error', 'None'],
          correctAnswer: 0,
          explanation: 'This is a ternary operator. Since 20 >= 18 is True, the result is "adult".'
        },
        {
          question: 'Can you have an if statement without an else?',
          options: ['Yes', 'No', 'Only with elif', 'Only in functions'],
          correctAnswer: 0,
          explanation: 'The else clause is optional. An if statement can stand alone.'
        },
        {
          question: 'How many elif blocks can you have?',
          options: ['Only 1', 'Maximum 5', 'Unlimited', 'Maximum 10'],
          correctAnswer: 2,
          explanation: 'Python allows unlimited elif blocks in an if-elif-else chain.'
        }
      ]
    });

    // Python - Loops quiz
    quizzes.push({
      course: savedCourses[0]._id,
      topicIndex: 1,
      subtopicIndex: 1,
      title: 'Loops Quiz',
      questions: [
        {
          question: 'What does range(5) generate?',
          options: ['[1, 2, 3, 4, 5]', '[0, 1, 2, 3, 4]', '[0, 1, 2, 3, 4, 5]', '[1, 2, 3, 4]'],
          correctAnswer: 1,
          explanation: 'range(5) generates numbers from 0 to 4 (5 is excluded).'
        },
        {
          question: 'Which statement skips the current iteration?',
          options: ['break', 'skip', 'continue', 'pass'],
          correctAnswer: 2,
          explanation: 'The "continue" statement skips the rest of the current iteration and moves to the next one.'
        },
        {
          question: 'What is the result of [x**2 for x in range(4)]?',
          options: ['[0, 1, 4, 9]', '[1, 4, 9, 16]', '[0, 1, 2, 3]', '[1, 2, 3, 4]'],
          correctAnswer: 0,
          explanation: 'This list comprehension squares each number in range(4): 0²=0, 1²=1, 2²=4, 3²=9.'
        },
        {
          question: 'Which loop is best when you don\'t know the number of iterations?',
          options: ['for loop', 'while loop', 'do-while loop', 'foreach loop'],
          correctAnswer: 1,
          explanation: 'A while loop is ideal when the number of iterations depends on a condition that may change dynamically.'
        },
        {
          question: 'What does the "break" statement do?',
          options: ['Skips current iteration', 'Exits the loop entirely', 'Pauses the loop', 'Restarts the loop'],
          correctAnswer: 1,
          explanation: 'The "break" statement immediately exits the loop it is in.'
        }
      ]
    });

    // Python - Functions quiz
    quizzes.push({
      course: savedCourses[0]._id,
      topicIndex: 2,
      subtopicIndex: 0,
      title: 'Functions Quiz',
      questions: [
        {
          question: 'What keyword is used to define a function in Python?',
          options: ['function', 'func', 'def', 'define'],
          correctAnswer: 2,
          explanation: 'Python uses the "def" keyword to define functions.'
        },
        {
          question: 'What does a function return if there is no return statement?',
          options: ['0', 'None', 'Empty string', 'Error'],
          correctAnswer: 1,
          explanation: 'If no return statement is specified, Python functions return None by default.'
        },
        {
          question: 'What does *args allow?',
          options: ['Single argument', 'Variable number of keyword arguments', 'Variable number of positional arguments', 'No arguments'],
          correctAnswer: 2,
          explanation: '*args allows a function to accept any number of positional arguments as a tuple.'
        },
        {
          question: 'What is the scope of a variable defined inside a function?',
          options: ['Global', 'Local', 'Universal', 'Module'],
          correctAnswer: 1,
          explanation: 'Variables defined inside a function have local scope and cannot be accessed outside the function.'
        },
        {
          question: 'What does **kwargs do?',
          options: ['Accepts a list', 'Accepts keyword arguments as a dictionary', 'Creates a class', 'None of the above'],
          correctAnswer: 1,
          explanation: '**kwargs allows a function to accept any number of keyword arguments, received as a dictionary.'
        }
      ]
    });

    // JavaScript - Variables quiz
    quizzes.push({
      course: savedCourses[1]._id,
      topicIndex: 0,
      subtopicIndex: 0,
      title: 'JavaScript Variables and Scope Quiz',
      questions: [
        {
          question: 'Which variable declaration is block-scoped?',
          options: ['var', 'let', 'Both var and let', 'Neither'],
          correctAnswer: 1,
          explanation: 'let (and const) are block-scoped, while var is function-scoped.'
        },
        {
          question: 'What is the value of typeof null?',
          options: ['"null"', '"undefined"', '"object"', '"boolean"'],
          correctAnswer: 2,
          explanation: 'This is a known JavaScript quirk. typeof null returns "object", which is considered a bug in the language.'
        },
        {
          question: 'Which is preferred for constants?',
          options: ['var', 'let', 'const', 'static'],
          correctAnswer: 2,
          explanation: 'const is used for values that should not be reassigned.'
        },
        {
          question: 'Template literals use which characters?',
          options: ['Single quotes', 'Double quotes', 'Backticks', 'Parentheses'],
          correctAnswer: 2,
          explanation: 'Template literals use backticks (`) and allow embedded expressions with ${expression}.'
        },
        {
          question: 'What is the Temporal Dead Zone?',
          options: ['A memory leak', 'Time before let/const declaration is reached', 'A deprecated feature', 'A debugging tool'],
          correctAnswer: 1,
          explanation: 'The TDZ is the period between entering a scope and the let/const variable\'s declaration being processed.'
        }
      ]
    });

    // JavaScript - Functions quiz
    quizzes.push({
      course: savedCourses[1]._id,
      topicIndex: 0,
      subtopicIndex: 1,
      title: 'Functions and Arrow Functions Quiz',
      questions: [
        {
          question: 'Arrow functions have their own "this" context.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'Arrow functions do NOT have their own "this". They inherit "this" from the enclosing scope.'
        },
        {
          question: 'What does [1,2,3].map(x => x * 2) return?',
          options: ['[1, 2, 3]', '[2, 4, 6]', '[1, 4, 9]', 'undefined'],
          correctAnswer: 1,
          explanation: 'map() creates a new array by applying the function to each element. Each element is multiplied by 2.'
        },
        {
          question: 'What is a closure?',
          options: ['A type of loop', 'A function with access to its outer scope', 'A class', 'An error handler'],
          correctAnswer: 1,
          explanation: 'A closure is a function that remembers and can access variables from its outer (enclosing) scope.'
        },
        {
          question: 'What does reduce() do?',
          options: ['Filters an array', 'Transforms each element', 'Accumulates values into a single result', 'Sorts an array'],
          correctAnswer: 2,
          explanation: 'reduce() processes array elements and accumulates them into a single value.'
        },
        {
          question: 'Which is a valid arrow function?',
          options: ['x -> x * 2', 'x => x * 2', 'function(x) => x * 2', 'x --> x * 2'],
          correctAnswer: 1,
          explanation: 'Arrow functions in JavaScript use the => syntax. For single parameters, parentheses are optional.'
        }
      ]
    });

    // JavaScript - DOM quiz
    quizzes.push({
      course: savedCourses[1]._id,
      topicIndex: 1,
      subtopicIndex: 0,
      title: 'DOM Manipulation Quiz',
      questions: [
        {
          question: 'Which method returns the first matching element?',
          options: ['getElementById', 'querySelectorAll', 'querySelector', 'getElementsByClassName'],
          correctAnswer: 2,
          explanation: 'querySelector returns the first element that matches the CSS selector.'
        },
        {
          question: 'How do you add a CSS class to an element?',
          options: ['element.class = "name"', 'element.classList.add("name")', 'element.addStyle("name")', 'element.css("name")'],
          correctAnswer: 1,
          explanation: 'classList.add() is the standard way to add CSS classes to an element.'
        },
        {
          question: 'Which property sets the text content of an element?',
          options: ['innerText', 'textContent', 'Both a and b', 'text'],
          correctAnswer: 2,
          explanation: 'Both innerText and textContent can set text, though textContent is more commonly preferred.'
        },
        {
          question: 'What does event.preventDefault() do?',
          options: ['Stops event bubbling', 'Prevents the default browser action', 'Removes the event listener', 'Reloads the page'],
          correctAnswer: 1,
          explanation: 'preventDefault() stops the browser\'s default action for an event (e.g., form submission, link navigation).'
        },
        {
          question: 'How do you create a new HTML element?',
          options: ['document.create("div")', 'document.createElement("div")', 'document.newElement("div")', 'new Element("div")'],
          correctAnswer: 1,
          explanation: 'document.createElement() creates a new HTML element of the specified type.'
        }
      ]
    });

    // Data Science - Descriptive Statistics quiz
    quizzes.push({
      course: savedCourses[2]._id,
      topicIndex: 0,
      subtopicIndex: 0,
      title: 'Descriptive Statistics Quiz',
      questions: [
        {
          question: 'Which measure of central tendency is most affected by outliers?',
          options: ['Median', 'Mode', 'Mean', 'Range'],
          correctAnswer: 2,
          explanation: 'The mean is calculated using all values, so extreme outliers can significantly shift it.'
        },
        {
          question: 'What is the standard deviation a measure of?',
          options: ['Central tendency', 'Data spread/dispersion', 'Probability', 'Correlation'],
          correctAnswer: 1,
          explanation: 'Standard deviation measures how spread out values are from the mean.'
        },
        {
          question: 'The IQR is calculated as:',
          options: ['Q3 - Q1', 'Q2 - Q1', 'Max - Min', 'Mean - Median'],
          correctAnswer: 0,
          explanation: 'IQR (Interquartile Range) = Q3 (75th percentile) - Q1 (25th percentile).'
        },
        {
          question: 'What is the median of [2, 4, 6, 8, 10]?',
          options: ['4', '6', '8', '5'],
          correctAnswer: 1,
          explanation: 'The median is the middle value in a sorted list. With 5 values, the middle (3rd) value is 6.'
        },
        {
          question: 'Which Python library is commonly used for statistical calculations?',
          options: ['Django', 'Flask', 'NumPy', 'Requests'],
          correctAnswer: 2,
          explanation: 'NumPy provides mathematical functions including mean, median, standard deviation, and more.'
        }
      ]
    });

    // Data Science - Probability quiz
    quizzes.push({
      course: savedCourses[2]._id,
      topicIndex: 0,
      subtopicIndex: 1,
      title: 'Probability Basics Quiz',
      questions: [
        {
          question: 'Probability values range between:',
          options: ['-1 and 1', '0 and 100', '0 and 1', '1 and 10'],
          correctAnswer: 2,
          explanation: 'Probability is always between 0 (impossible) and 1 (certain).'
        },
        {
          question: 'What is the probability of getting heads on a fair coin flip?',
          options: ['0.25', '0.5', '0.75', '1.0'],
          correctAnswer: 1,
          explanation: 'A fair coin has 2 equally likely outcomes, so P(heads) = 1/2 = 0.5.'
        },
        {
          question: 'Two events are independent if:',
          options: ['They cannot occur together', 'One event does not affect the other', 'They always occur together', 'They are mutually exclusive'],
          correctAnswer: 1,
          explanation: 'Independent events are those where the occurrence of one does not affect the probability of the other.'
        },
        {
          question: 'P(A and B) for independent events equals:',
          options: ['P(A) + P(B)', 'P(A) × P(B)', 'P(A) - P(B)', 'P(A) / P(B)'],
          correctAnswer: 1,
          explanation: 'For independent events, the probability of both occurring is the product of individual probabilities.'
        },
        {
          question: 'The sum of all probabilities in a sample space equals:',
          options: ['0', '0.5', '1', 'Infinity'],
          correctAnswer: 2,
          explanation: 'The total probability of all possible outcomes in a sample space always equals 1.'
        }
      ]
    });

    // Data Science - Pandas quiz
    quizzes.push({
      course: savedCourses[2]._id,
      topicIndex: 1,
      subtopicIndex: 0,
      title: 'Introduction to Pandas Quiz',
      questions: [
        {
          question: 'What is the primary data structure in Pandas?',
          options: ['Array', 'List', 'DataFrame', 'Dictionary'],
          correctAnswer: 2,
          explanation: 'DataFrame is the primary 2D data structure in Pandas.'
        },
        {
          question: 'How do you read a CSV file in Pandas?',
          options: ['pd.open_csv()', 'pd.read_csv()', 'pd.load_csv()', 'pd.import_csv()'],
          correctAnswer: 1,
          explanation: 'pd.read_csv() is used to read CSV files into a DataFrame.'
        },
        {
          question: 'What does df.describe() show?',
          options: ['Column names', 'Data types', 'Statistical summary', 'First 5 rows'],
          correctAnswer: 2,
          explanation: 'describe() provides count, mean, std, min, 25%, 50%, 75%, and max for numerical columns.'
        },
        {
          question: 'How do you handle missing values?',
          options: ['df.dropna()', 'df.fillna()', 'Both a and b', 'df.remove_null()'],
          correctAnswer: 2,
          explanation: 'Both dropna() (removes rows) and fillna() (replaces with values) handle missing data.'
        },
        {
          question: 'What does df.groupby() do?',
          options: ['Sorts data', 'Groups data by column for aggregation', 'Merges DataFrames', 'Filters data'],
          correctAnswer: 1,
          explanation: 'groupby() groups data by one or more columns, allowing aggregate operations on each group.'
        }
      ]
    });

    // MongoDB - NoSQL quiz
    quizzes.push({
      course: savedCourses[3]._id,
      topicIndex: 0,
      subtopicIndex: 0,
      title: 'NoSQL and MongoDB Introduction Quiz',
      questions: [
        {
          question: 'MongoDB is what type of database?',
          options: ['Relational', 'Document-oriented', 'Graph', 'Key-Value'],
          correctAnswer: 1,
          explanation: 'MongoDB is a document-oriented NoSQL database that stores data in JSON-like documents.'
        },
        {
          question: 'What is the MongoDB equivalent of a SQL table?',
          options: ['Document', 'Collection', 'Database', 'Field'],
          correctAnswer: 1,
          explanation: 'In MongoDB, a collection is equivalent to a table in SQL databases.'
        },
        {
          question: 'MongoDB stores data in what format?',
          options: ['XML', 'CSV', 'BSON (Binary JSON)', 'Plain Text'],
          correctAnswer: 2,
          explanation: 'MongoDB stores data in BSON format, which is a binary representation of JSON-like documents.'
        },
        {
          question: 'What field is automatically added to every MongoDB document?',
          options: ['id', '_id', 'key', 'index'],
          correctAnswer: 1,
          explanation: 'MongoDB automatically creates an _id field as a unique identifier if one is not provided.'
        },
        {
          question: 'Which is an advantage of MongoDB?',
          options: ['Rigid schema', 'Fixed data types', 'Flexible schema', 'SQL queries only'],
          correctAnswer: 2,
          explanation: 'MongoDB has a flexible schema, allowing documents in the same collection to have different structures.'
        }
      ]
    });

    // MongoDB - CRUD quiz
    quizzes.push({
      course: savedCourses[3]._id,
      topicIndex: 0,
      subtopicIndex: 1,
      title: 'MongoDB CRUD Operations Quiz',
      questions: [
        {
          question: 'Which method inserts a single document?',
          options: ['insert()', 'insertOne()', 'addOne()', 'create()'],
          correctAnswer: 1,
          explanation: 'insertOne() inserts a single document into a collection.'
        },
        {
          question: 'What does the $set operator do in an update?',
          options: ['Deletes a field', 'Sets specific field values', 'Creates a new document', 'Increments a value'],
          correctAnswer: 1,
          explanation: '$set modifies only the specified fields without affecting other fields in the document.'
        },
        {
          question: 'Which operator increments a field value?',
          options: ['$set', '$add', '$inc', '$plus'],
          correctAnswer: 2,
          explanation: '$inc increments a field by a specified value.'
        },
        {
          question: 'How do you find all documents in a collection?',
          options: ['db.col.findAll()', 'db.col.find()', 'db.col.getAll()', 'db.col.select()'],
          correctAnswer: 1,
          explanation: 'find() with no filter returns all documents in the collection.'
        },
        {
          question: 'What does $gt mean in a query?',
          options: ['Get total', 'Greater than', 'Group together', 'Generate table'],
          correctAnswer: 1,
          explanation: '$gt is a comparison operator meaning "greater than".'
        }
      ]
    });

    // ML - Types quiz
    quizzes.push({
      course: savedCourses[4]._id,
      topicIndex: 0,
      subtopicIndex: 0,
      title: 'Types of Machine Learning Quiz',
      questions: [
        {
          question: 'Which type of ML uses labeled data?',
          options: ['Unsupervised', 'Reinforcement', 'Supervised', 'Semi-supervised'],
          correctAnswer: 2,
          explanation: 'Supervised learning trains on labeled data where both inputs and expected outputs are provided.'
        },
        {
          question: 'Email spam detection is an example of:',
          options: ['Regression', 'Classification', 'Clustering', 'Reinforcement'],
          correctAnswer: 1,
          explanation: 'Spam detection classifies emails into categories (spam/not spam), making it a classification problem.'
        },
        {
          question: 'What is overfitting?',
          options: ['Model performs well on new data', 'Model is too simple', 'Model memorizes training data', 'Model ignores patterns'],
          correctAnswer: 2,
          explanation: 'Overfitting occurs when a model learns the training data too well, including noise, and performs poorly on new data.'
        },
        {
          question: 'K-Means is an example of:',
          options: ['Supervised learning', 'Unsupervised learning', 'Reinforcement learning', 'Deep learning'],
          correctAnswer: 1,
          explanation: 'K-Means is a clustering algorithm that groups data without labels — unsupervised learning.'
        },
        {
          question: 'The typical training/testing split ratio is:',
          options: ['50/50', '90/10', '80/20', '60/40'],
          correctAnswer: 2,
          explanation: 'A common split is 80% training / 20% testing (or 70/30) to ensure adequate training while validating performance.'
        }
      ]
    });

    await Quiz.insertMany(quizzes);
    console.log(`Inserted ${quizzes.length} quizzes`);

    console.log('\n✅ Database seeded successfully!');
    console.log('Admin Login: admin@elearning.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
