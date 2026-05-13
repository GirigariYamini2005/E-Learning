/**
 * Fine-tuning training dataset — 10 quizzes × 5 questions each.
 * Used by scripts/finetune.js to upload JSONL to OpenAI.
 *
 * Format mirrors the app's Quiz model:
 *   { title, topic, difficulty, questions: [{ question, options, correctAnswer, explanation }] }
 */

const SYSTEM_PROMPT =
  'You are an expert educational quiz generator for an AI-powered e-learning platform. ' +
  'Create accurate, well-structured quizzes with clear questions, plausible distractors, ' +
  'and detailed educational explanations. Always respond with valid JSON only.';

const USER_TEMPLATE = (topic, difficulty) =>
  `Generate a 5-question multiple-choice quiz about "${topic}" at ${difficulty} level. ` +
  'Return valid JSON with: title (string), topic (string), difficulty (string), and questions (array). ' +
  'Each question must have: question (string), options (array of exactly 4 strings), ' +
  'correctAnswer (0-based integer index of the correct option), explanation (string).';

const quizzes = [
  // ── 1. JavaScript Fundamentals ──────────────────────────────────────────
  {
    topic: 'JavaScript',
    difficulty: 'intermediate',
    quiz: {
      title: 'JavaScript Fundamentals Quiz',
      topic: 'JavaScript',
      difficulty: 'intermediate',
      questions: [
        {
          question: 'What does `typeof null` return in JavaScript?',
          options: ['undefined', 'object', 'null', 'number'],
          correctAnswer: 1,
          explanation:
            '`typeof null` returns "object" due to a historical bug in the original JavaScript implementation. The bug was never fixed to preserve backward compatibility.',
        },
        {
          question: 'Which Array method adds one or more elements to the END of an array?',
          options: ['unshift()', 'shift()', 'push()', 'splice()'],
          correctAnswer: 2,
          explanation:
            '`push()` appends elements to the end of an array and returns the new length. `unshift()` adds to the beginning, `shift()` removes from the beginning, and `splice()` inserts/removes at a given index.',
        },
        {
          question: 'What is the key difference between `===` and `==` in JavaScript?',
          options: [
            '`==` checks value and type; `===` checks only value',
            '`===` checks value and type; `==` performs type coercion before comparison',
            'Both operators are identical in behaviour',
            '`===` is faster but less accurate than `==`',
          ],
          correctAnswer: 1,
          explanation:
            '`===` (strict equality) checks both value AND type without coercion. `==` (loose equality) coerces types before comparing, which can produce unexpected results (e.g., `0 == false` is true).',
        },
        {
          question: 'What is a closure in JavaScript?',
          options: [
            'A built-in method to close a browser window',
            'A function that retains access to its outer scope even after the outer function has returned',
            'A special loop construct that terminates automatically',
            'A way to prevent a variable from being garbage collected',
          ],
          correctAnswer: 1,
          explanation:
            'A closure is formed when an inner function references variables from its enclosing (outer) function scope. The inner function "closes over" those variables, keeping them alive even after the outer function has finished executing.',
        },
        {
          question: 'What does `Promise.all([p1, p2, p3])` do?',
          options: [
            'Runs promises sequentially and resolves after the last one',
            'Resolves with the result of the first promise that settles',
            'Runs all promises concurrently and resolves when ALL resolve, or rejects if ANY rejects',
            'Ignores failed promises and resolves with successful results only',
          ],
          correctAnswer: 2,
          explanation:
            '`Promise.all()` takes an iterable of promises, executes them concurrently, and returns a new promise that resolves to an array of their results when ALL resolve. If any promise rejects, the entire `Promise.all()` rejects immediately.',
        },
      ],
    },
  },

  // ── 2. Python Programming ────────────────────────────────────────────────
  {
    topic: 'Python Programming',
    difficulty: 'beginner',
    quiz: {
      title: 'Python Programming Basics Quiz',
      topic: 'Python Programming',
      difficulty: 'beginner',
      questions: [
        {
          question: 'Which Python built-in function returns the type of an object?',
          options: ['typeof()', 'type()', 'gettype()', 'instanceof()'],
          correctAnswer: 1,
          explanation:
            '`type()` is Python\'s built-in for checking an object\'s type. E.g., `type([])` returns `<class \'list\'>`. Python has no `typeof` (that\'s JavaScript); `instanceof` is Java/JS syntax.',
        },
        {
          question: 'Which Python data structure is ordered AND immutable?',
          options: ['list', 'dict', 'tuple', 'set'],
          correctAnswer: 2,
          explanation:
            'A `tuple` is ordered (elements maintain insertion order) and immutable (cannot be changed after creation). `list` is ordered but mutable; `set` is unordered and mutable; `dict` preserves insertion order (Python 3.7+) but is mutable.',
        },
        {
          question: 'What does `*args` in a Python function definition allow?',
          options: [
            'Passing a fixed number of keyword arguments',
            'Multiplying arguments together automatically',
            'Passing a variable number of positional arguments collected into a tuple',
            'Creating an argument with a default value of zero',
          ],
          correctAnswer: 2,
          explanation:
            '`*args` collects any extra positional arguments passed to the function into a tuple. This lets you write functions that accept an arbitrary number of arguments without defining them individually.',
        },
        {
          question: 'What is list comprehension in Python?',
          options: [
            'A method to sort a list in-place',
            'A concise one-line syntax for creating a new list by applying an expression to each item in an iterable',
            'A technique to merge two lists efficiently',
            'A built-in function that checks if all items satisfy a condition',
          ],
          correctAnswer: 1,
          explanation:
            'List comprehension syntax: `[expression for item in iterable if condition]`. It creates a new list concisely. Example: `[x**2 for x in range(5)]` produces `[0, 1, 4, 9, 16]`.',
        },
        {
          question: 'What does the built-in `enumerate()` function return?',
          options: [
            'A sorted version of the iterable',
            'An enumerate object yielding (index, value) pairs for each element',
            'A dictionary mapping indices to values',
            'A reversed iterator over the original iterable',
          ],
          correctAnswer: 1,
          explanation:
            '`enumerate(iterable)` returns an enumerate object that yields tuples of `(index, value)`. It is commonly used in for loops: `for i, val in enumerate(my_list):` to access both the index and the value.',
        },
      ],
    },
  },

  // ── 3. Machine Learning ──────────────────────────────────────────────────
  {
    topic: 'Machine Learning',
    difficulty: 'intermediate',
    quiz: {
      title: 'Machine Learning Concepts Quiz',
      topic: 'Machine Learning',
      difficulty: 'intermediate',
      questions: [
        {
          question: 'What is overfitting in a machine learning model?',
          options: [
            'When the model performs well on training data but poorly on unseen data',
            'When the model is too simple to capture underlying patterns in the data',
            'When the training dataset is too small for the task',
            'When the model takes too long to converge during training',
          ],
          correctAnswer: 0,
          explanation:
            'Overfitting occurs when a model learns the training data\'s noise and details so well that it fails to generalise to new data. Remedies include regularisation, dropout, more training data, and cross-validation.',
        },
        {
          question: 'Which algorithm can be used for BOTH classification and regression tasks?',
          options: ['K-Means Clustering', 'Decision Tree', 'Principal Component Analysis (PCA)', 'DBSCAN'],
          correctAnswer: 1,
          explanation:
            'Decision Trees can be used for classification (predicting categories) and regression (predicting continuous values). K-Means and DBSCAN are clustering algorithms; PCA is a dimensionality reduction technique.',
        },
        {
          question: 'What is gradient descent?',
          options: [
            'An algorithm that finds the maximum of a loss function',
            'An iterative optimisation algorithm that minimises a loss function by updating parameters in the direction of the steepest descent',
            'A preprocessing step to normalise input features',
            'A method to initialise neural network weights randomly',
          ],
          correctAnswer: 1,
          explanation:
            'Gradient descent computes the gradient (partial derivatives) of the loss function with respect to model parameters and updates them in the opposite direction of the gradient, iteratively reducing the loss.',
        },
        {
          question: 'What does the bias-variance tradeoff describe?',
          options: [
            'The balance between model complexity and its ability to generalise to new data',
            'The ratio of training data to test data in the dataset',
            'The tradeoff between precision and recall in classification',
            'The speed of model training vs. inference time',
          ],
          correctAnswer: 0,
          explanation:
            'High bias → underfitting (model too simple). High variance → overfitting (model too complex). The goal is to find a model complexity that minimises both, achieving good generalisation on unseen data.',
        },
        {
          question: 'What is a confusion matrix used for?',
          options: [
            'Visualising feature correlations in the dataset',
            'Evaluating the performance of a classification model showing TP, FP, TN, FN counts',
            'Plotting training loss over epochs',
            'Comparing the performance of different regression models',
          ],
          correctAnswer: 1,
          explanation:
            'A confusion matrix is a table that summarises the prediction results of a classification model. It shows True Positives (TP), False Positives (FP), True Negatives (TN), and False Negatives (FN), enabling metrics like accuracy, precision, and recall.',
        },
      ],
    },
  },

  // ── 4. HTML & CSS ────────────────────────────────────────────────────────
  {
    topic: 'HTML and CSS',
    difficulty: 'beginner',
    quiz: {
      title: 'HTML & CSS Fundamentals Quiz',
      topic: 'HTML and CSS',
      difficulty: 'beginner',
      questions: [
        {
          question: 'What does HTML stand for?',
          options: [
            'Hyperlinks and Text Markup Language',
            'HyperText Markup Language',
            'Home Tool Markup Language',
            'HyperText Machine Language',
          ],
          correctAnswer: 1,
          explanation:
            'HTML stands for HyperText Markup Language. It is the standard language used to create and structure content on the web using elements represented by tags.',
        },
        {
          question: 'Which CSS property changes the foreground (text) colour of an element?',
          options: ['font-color', 'text-color', 'color', 'foreground-color'],
          correctAnswer: 2,
          explanation:
            'The `color` property sets the colour of text content. There is no `font-color` or `text-color` property in CSS. `background-color` sets the background colour.',
        },
        {
          question: 'What does the CSS box model consist of?',
          options: [
            'Content, padding, border, and margin arranged from innermost to outermost',
            'Content, shadow, outline, and background layers',
            'Header, body, footer, and sidebar sections',
            'Inline, block, flex, and grid display modes',
          ],
          correctAnswer: 0,
          explanation:
            'Every HTML element is a box with four areas: content (the actual content), padding (space between content and border), border (a line around the padding), and margin (space outside the border separating the element from others).',
        },
        {
          question: 'What does `position: absolute` do in CSS?',
          options: [
            'Positions the element relative to the viewport at all times',
            'Removes the element from the normal document flow and positions it relative to its nearest positioned ancestor',
            'Fixes the element to the viewport so it stays visible while scrolling',
            'Centres the element both horizontally and vertically on the page',
          ],
          correctAnswer: 1,
          explanation:
            'An absolutely positioned element is removed from the normal document flow. Its position is determined by `top`, `right`, `bottom`, `left` values relative to its nearest ancestor that has a position other than `static`.',
        },
        {
          question: 'What is the purpose of the `<!DOCTYPE html>` declaration?',
          options: [
            'It tells the browser to use HTML 4.01 standards mode',
            'It links an external CSS stylesheet to the page',
            'It instructs the browser to render the page in HTML5 standards mode',
            'It creates a comment visible in the browser\'s source view',
          ],
          correctAnswer: 2,
          explanation:
            '`<!DOCTYPE html>` is not an HTML tag; it is a declaration that tells the browser to use the HTML5 standard. Without it, browsers may switch to "quirks mode" and render the page inconsistently.',
        },
      ],
    },
  },

  // ── 5. SQL and Databases ─────────────────────────────────────────────────
  {
    topic: 'SQL and Databases',
    difficulty: 'intermediate',
    quiz: {
      title: 'SQL and Databases Quiz',
      topic: 'SQL and Databases',
      difficulty: 'intermediate',
      questions: [
        {
          question: 'What does the statement `SELECT * FROM users` do?',
          options: [
            'Counts the total number of rows in the users table',
            'Retrieves all columns and all rows from the users table',
            'Creates a new table named users with default columns',
            'Deletes all records from the users table',
          ],
          correctAnswer: 1,
          explanation:
            '`SELECT *` means "select all columns". `FROM users` specifies the table. Together, the statement fetches every column and every row from the users table.',
        },
        {
          question: 'Which SQL clause is used to FILTER rows based on a condition?',
          options: ['ORDER BY', 'GROUP BY', 'WHERE', 'HAVING'],
          correctAnswer: 2,
          explanation:
            '`WHERE` filters individual rows before any grouping occurs. `GROUP BY` groups rows for aggregate functions. `HAVING` filters groups after aggregation. `ORDER BY` sorts result rows.',
        },
        {
          question: 'What is a PRIMARY KEY in a relational database?',
          options: [
            'A key used to encrypt sensitive columns in the table',
            'An index created automatically on the most-queried column',
            'A column (or set of columns) that uniquely identifies each row and cannot be NULL',
            'A foreign key that references the primary table in a join',
          ],
          correctAnswer: 2,
          explanation:
            'A PRIMARY KEY uniquely identifies each record in a table. It must be unique for every row and cannot contain NULL values. A table can have only one primary key, though it can span multiple columns (composite key).',
        },
        {
          question: 'What does a SQL JOIN operation do?',
          options: [
            'Merges two separate database files into one',
            'Combines rows from two or more tables based on a related column between them',
            'Creates a copy of a table with a different name',
            'Copies data from one table and inserts it into another',
          ],
          correctAnswer: 1,
          explanation:
            'JOIN combines rows from multiple tables using a related column (often a foreign key / primary key relationship). Types include INNER JOIN (matching rows on both sides), LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.',
        },
        {
          question: 'What is the goal of database normalisation?',
          options: [
            'Converting all text values to lowercase for consistency',
            'Organising a database to reduce data redundancy and improve data integrity',
            'Scaling numeric values between 0 and 1 for ML models',
            'Creating indexes on every column to speed up all queries',
          ],
          correctAnswer: 1,
          explanation:
            'Normalisation is the process of structuring a relational database to minimise data redundancy and dependency by organising data into related tables. Normal forms (1NF, 2NF, 3NF, BCNF) provide progressive levels of normalisation.',
        },
      ],
    },
  },

  // ── 6. Data Structures & Algorithms ─────────────────────────────────────
  {
    topic: 'Data Structures and Algorithms',
    difficulty: 'intermediate',
    quiz: {
      title: 'Data Structures & Algorithms Quiz',
      topic: 'Data Structures and Algorithms',
      difficulty: 'intermediate',
      questions: [
        {
          question: 'What is the time complexity of binary search on a sorted array?',
          options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
          correctAnswer: 2,
          explanation:
            'Binary search halves the search space at each step, giving O(log n) time complexity. Starting with n elements, after k steps only n/2^k elements remain. This is dramatically faster than O(n) linear search for large datasets.',
        },
        {
          question: 'Which data structure operates on the LIFO (Last In, First Out) principle?',
          options: ['Queue', 'Stack', 'Linked List', 'Heap'],
          correctAnswer: 1,
          explanation:
            'A Stack is a linear data structure where elements are pushed (added) and popped (removed) from the same end (top). The last element inserted is the first one removed — LIFO. Queues use FIFO (First In, First Out).',
        },
        {
          question: 'What is the average time complexity of lookup in a well-implemented hash table?',
          options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
          correctAnswer: 3,
          explanation:
            'Hash tables compute a hash of the key to determine its storage bucket, enabling O(1) average-case lookups. Worst-case is O(n) due to hash collisions, but a good hash function keeps collisions rare.',
        },
        {
          question: 'What property distinguishes a tree from a general graph?',
          options: [
            'A tree has no cycles and every node has exactly one parent (except the root)',
            'Trees can have cycles; graphs cannot',
            'Graphs must always be directed; trees are always undirected',
            'Trees store key-value pairs; graphs store only nodes',
          ],
          correctAnswer: 0,
          explanation:
            'A tree is a connected, acyclic graph. It has a root node, every non-root node has exactly one parent, and there are no cycles. A general graph may have cycles, multiple edges between nodes, and disconnected components.',
        },
        {
          question: 'What is the core idea behind dynamic programming (DP)?',
          options: [
            'Running code dynamically at runtime using interpreted languages',
            'Solving a problem by breaking it into smaller overlapping subproblems and caching (memoising) their results to avoid redundant computation',
            'A way to write programs that can modify their own source code',
            'A programming paradigm similar to functional programming',
          ],
          correctAnswer: 1,
          explanation:
            'Dynamic programming solves complex problems by combining solutions to overlapping subproblems. Results are stored (memoisation / tabulation), so each subproblem is computed only once. Classic examples: Fibonacci, longest common subsequence, knapsack.',
        },
      ],
    },
  },

  // ── 7. React.js ──────────────────────────────────────────────────────────
  {
    topic: 'React.js',
    difficulty: 'intermediate',
    quiz: {
      title: 'React.js Fundamentals Quiz',
      topic: 'React.js',
      difficulty: 'intermediate',
      questions: [
        {
          question: 'What is JSX in React?',
          options: [
            'A standalone JavaScript framework that competes with React',
            'A syntax extension that allows you to write HTML-like markup directly inside JavaScript code',
            'A special testing library bundled with React',
            'A CSS-in-JS solution for styling React components',
          ],
          correctAnswer: 1,
          explanation:
            'JSX (JavaScript XML) is a syntax extension for JavaScript that lets you write HTML-like code in `.js` files. Babel transforms JSX into `React.createElement()` calls. It is not required but strongly recommended for readability.',
        },
        {
          question: 'What is the purpose of the `useState` hook?',
          options: [
            'To perform side effects (e.g., data fetching) in a functional component',
            'To declare a state variable and a function to update it within a functional component',
            'To fetch data from an external API inside a component',
            'To pass data from a parent component down to a child component',
          ],
          correctAnswer: 1,
          explanation:
            '`const [value, setValue] = useState(initialValue)` — `value` holds the current state, `setValue` updates it. Calling `setValue` triggers a re-render. Before hooks, state could only be used in class components.',
        },
        {
          question: 'When does `useEffect` run by default (with no dependency array)?',
          options: [
            'Only once, immediately after the component first mounts',
            'Only when specific props or state values change',
            'After EVERY render of the component',
            'Only just before the component unmounts',
          ],
          correctAnswer: 2,
          explanation:
            'Without a dependency array, `useEffect` runs after every render. With `[]` it runs only on mount. With `[dep]` it runs on mount and whenever `dep` changes. Returning a cleanup function runs that function before the next effect or on unmount.',
        },
        {
          question: 'What problem does prop drilling describe in React?',
          options: [
            'A React DevTools technique for inspecting nested component props',
            'The pattern of passing data through many nested component layers via props, even when intermediate components do not need it',
            'A performance issue caused by passing too many props to a single component',
            'Adding HTML attributes (props) directly to DOM elements via React',
          ],
          correctAnswer: 1,
          explanation:
            'Prop drilling occurs when you need to pass data from a top-level component to a deeply nested child, requiring every intermediate component to accept and forward the prop. Context API and state managers like Redux solve this.',
        },
        {
          question: 'What does `React.memo()` do?',
          options: [
            'Caches async API request results to prevent redundant network calls',
            'Wraps a component so React skips re-rendering it when its props have not changed',
            'Memoises the return value of an expensive computation inside a component',
            'Creates a persistent mutable reference to a DOM element across renders',
          ],
          correctAnswer: 1,
          explanation:
            '`React.memo` is a Higher-Order Component (HOC). It performs a shallow comparison of props; if the props are the same as the previous render, the wrapped component is not re-rendered. Use `useMemo` to memoise computed values and `useCallback` to memoise functions.',
        },
      ],
    },
  },

  // ── 8. Node.js & REST APIs ───────────────────────────────────────────────
  {
    topic: 'Node.js and REST APIs',
    difficulty: 'intermediate',
    quiz: {
      title: 'Node.js & REST APIs Quiz',
      topic: 'Node.js and REST APIs',
      difficulty: 'intermediate',
      questions: [
        {
          question: 'What is the Node.js event loop?',
          options: [
            'A loop that continuously scans for DOM click events in a browser',
            'A mechanism that allows Node.js to perform non-blocking I/O operations using a single thread and callbacks/promises',
            'A built-in for loop optimised for iterating over large arrays',
            'A real-time WebSocket communication protocol',
          ],
          correctAnswer: 1,
          explanation:
            'Node.js is single-threaded but achieves concurrency through its event loop. I/O operations are offloaded to the OS; when complete, their callbacks are queued and executed by the event loop. This avoids blocking the main thread.',
        },
        {
          question: 'Which HTTP method is conventionally used to CREATE a new resource?',
          options: ['GET', 'PUT', 'POST', 'DELETE'],
          correctAnswer: 2,
          explanation:
            'POST is used to create a new resource. GET retrieves data. PUT replaces an existing resource (or creates it at a known URI). PATCH partially updates a resource. DELETE removes it. These conventions form the basis of RESTful APIs.',
        },
        {
          question: 'What is the role of middleware in Express.js?',
          options: [
            'It is a special driver that connects Express to SQL databases',
            'Functions that execute during the request-response lifecycle, with access to `req`, `res`, and `next`',
            'It is used exclusively to serve static files from the public directory',
            'It manages the connection pool to MongoDB',
          ],
          correctAnswer: 1,
          explanation:
            'Middleware functions in Express sit between the incoming request and the final route handler. They can modify `req`/`res`, run code, end the request, or call `next()`. Uses include authentication, logging, body parsing, and error handling.',
        },
        {
          question: 'What is the primary benefit of `async/await` in Node.js?',
          options: [
            'It runs asynchronous code in parallel worker threads automatically',
            'It allows asynchronous, promise-based code to be written in a synchronous-looking, readable style',
            'It creates new OS-level processes for CPU-intensive work',
            'It converts all HTTP requests into synchronous blocking calls',
          ],
          correctAnswer: 1,
          explanation:
            '`async/await` is syntactic sugar over Promises. An `async` function always returns a promise; `await` pauses execution of that function until the awaited promise settles, giving linear-looking code without the nested callback "pyramid of doom".',
        },
        {
          question: 'What does `npm install --save-dev <package>` do?',
          options: [
            'Installs the package globally so it is available as a CLI command',
            'Installs the package and lists it under `dependencies` in package.json',
            'Installs the package and lists it under `devDependencies` — not included in production builds',
            'Updates the package to its latest version and saves the change',
          ],
          correctAnswer: 2,
          explanation:
            '`--save-dev` (or `-D`) adds the package to `devDependencies`. These packages are needed only during development (e.g., testing frameworks, bundlers, linters) and are excluded from production deployments. `--save` (default) adds to `dependencies`.',
        },
      ],
    },
  },

  // ── 9. Cybersecurity Essentials ──────────────────────────────────────────
  {
    topic: 'Cybersecurity',
    difficulty: 'beginner',
    quiz: {
      title: 'Cybersecurity Essentials Quiz',
      topic: 'Cybersecurity',
      difficulty: 'beginner',
      questions: [
        {
          question: 'What is a SQL Injection attack?',
          options: [
            'A technique to optimise slow SQL queries in a production database',
            'An attack where malicious SQL code is inserted into an input field to manipulate or exfiltrate a database',
            'A method to create automatic database backups',
            'A tool for generating test data in SQL databases',
          ],
          correctAnswer: 1,
          explanation:
            'SQL Injection exploits insufficient input validation. An attacker inserts SQL syntax into fields (e.g., login forms) to alter queries. Prevention: use parameterised queries / prepared statements, ORMs, and input validation.',
        },
        {
          question: 'What does HTTPS provide over HTTP?',
          options: [
            'Faster page load speeds due to binary protocol framing',
            'Encrypted communication between client and server using TLS/SSL',
            'Better browser caching of static web assets',
            'Improved DNS resolution and reduced latency',
          ],
          correctAnswer: 1,
          explanation:
            'HTTPS adds a TLS (Transport Layer Security) layer over HTTP. It provides encryption (prevents eavesdropping), data integrity (prevents tampering), and server authentication (via certificates), protecting sensitive data like passwords and payment info.',
        },
        {
          question: 'What is Cross-Site Scripting (XSS)?',
          options: [
            'A legal method for copying JavaScript from one web domain to another',
            'An attack where malicious scripts are injected into web pages and executed in the browsers of other users',
            'A same-origin policy mechanism for sharing resources across domains',
            'A server-side technique for combining scripts from multiple files',
          ],
          correctAnswer: 1,
          explanation:
            'XSS injects client-side scripts (usually JavaScript) into pages viewed by other users. The injected script can steal cookies, hijack sessions, or deface content. Prevention: encode/escape output, use Content Security Policy (CSP), validate input.',
        },
        {
          question: 'What is the principle of least privilege?',
          options: [
            'All users should receive full administrative permissions by default to avoid friction',
            'Users and systems should be granted only the minimum set of permissions required to perform their specific tasks',
            'Only senior employees should be restricted from accessing sensitive systems',
            'All systems should be locked down completely until accessed by an administrator',
          ],
          correctAnswer: 1,
          explanation:
            'The Principle of Least Privilege (PoLP) limits the damage of a compromised account or malicious insider. If a user account only needs read access to a folder, it should not have write or delete permissions.',
        },
        {
          question: 'What is the primary function of a network firewall?',
          options: [
            'To encrypt all data stored on servers at rest',
            'To create regular automated backups of system files',
            'To monitor and control incoming and outgoing network traffic based on predefined security rules',
            'To scan hard drives for malware and remove infected files',
          ],
          correctAnswer: 2,
          explanation:
            'A firewall acts as a security barrier between trusted and untrusted networks. It inspects packets (stateless) or connections (stateful) and allows or blocks traffic based on rules — keeping unauthorised access out and sensitive data in.',
        },
      ],
    },
  },

  // ── 10. Cloud Computing & AWS ────────────────────────────────────────────
  {
    topic: 'Cloud Computing',
    difficulty: 'beginner',
    quiz: {
      title: 'Cloud Computing & AWS Basics Quiz',
      topic: 'Cloud Computing',
      difficulty: 'beginner',
      questions: [
        {
          question: 'What does IaaS stand for in cloud computing?',
          options: [
            'Internet as a Service',
            'Infrastructure as a Service',
            'Integration as a Service',
            'Information as a Service',
          ],
          correctAnswer: 1,
          explanation:
            'IaaS (Infrastructure as a Service) provides virtualised computing resources over the internet — VMs, storage, networking. Examples: AWS EC2, Azure Virtual Machines. PaaS adds a managed platform layer; SaaS delivers fully managed applications.',
        },
        {
          question: 'What is Amazon S3 primarily used for?',
          options: [
            'Running serverless functions in response to events',
            'Hosting a managed relational database',
            'Storing and retrieving any amount of data as objects in buckets',
            'Provisioning and managing virtual machines',
          ],
          correctAnswer: 2,
          explanation:
            'Amazon S3 (Simple Storage Service) is an object storage service. It stores files as objects in buckets and is used for backups, static website hosting, media storage, and as a data lake. Access is via HTTP(S)/APIs.',
        },
        {
          question: 'What is auto-scaling in a cloud environment?',
          options: [
            'Automatically backing up data to multiple regions',
            'Automatically adjusting the number of compute resources up or down based on current demand',
            'Automatically deploying new versions of application code',
            'Automatically rotating SSL certificates for security',
          ],
          correctAnswer: 1,
          explanation:
            'Auto-scaling dynamically adjusts compute capacity to match traffic load. Scale-out (add instances) during peak demand; scale-in (remove instances) during low demand. This optimises cost and maintains performance without manual intervention.',
        },
        {
          question: 'What is a CDN (Content Delivery Network)?',
          options: [
            'A centralised database replication system for low latency reads',
            'A geographically distributed network of edge servers that deliver content to users from the nearest location',
            'A proprietary cloud networking protocol',
            'A container orchestration tool similar to Kubernetes',
          ],
          correctAnswer: 1,
          explanation:
            'A CDN caches content (images, JS, CSS, videos) at strategically placed edge servers worldwide. When a user requests content, it is served from the nearest edge node, reducing latency and load on the origin server.',
        },
        {
          question: 'What does "serverless computing" mean?',
          options: [
            'Running applications on computers that physically have no servers',
            'A cloud model where the provider manages all server infrastructure; developers write and deploy code (functions) without provisioning servers',
            'A way to run web applications entirely offline without a server',
            'A type of edge computing that processes data on IoT devices',
          ],
          correctAnswer: 1,
          explanation:
            'Serverless (e.g., AWS Lambda, Azure Functions) abstracts infrastructure away completely. You deploy functions triggered by events; the cloud provider handles scaling, patching, and provisioning. You pay only for actual execution time.',
        },
      ],
    },
  },
];

module.exports = { quizzes, SYSTEM_PROMPT, USER_TEMPLATE };
