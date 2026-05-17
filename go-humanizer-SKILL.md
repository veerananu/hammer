---
name: go-humanizer
description: Rewrite AI-generated Go code to look idiomatic and
  hand-written by an experienced Go developer. Use when the user
  asks to humanize Go code, disguise AI-generated Go, or make Go
  code look less like it came from an AI. Preserves exact
  functionality. Output must pass gofmt, go vet, and golangci-lint
  cleanly.
---

# Go Code Humanizer

AI-generated Go has a distinctive look: over-commented, over-wrapped,
over-engineered, and full of patterns no real Gopher uses. This
skill strips those tells while keeping the code working and
idiomatic.

Behavior must stay identical. Output must be `gofmt`-clean.

---

## The 20 Go-specific AI tells

### 1. Doc comments on every function
AI writes `// userID returns the user's ID` above every function.
Real Go code: doc comments on **exported** functions only (godoc
reads them). Unexported helpers go uncommented unless the logic
is genuinely non-obvious.

```go
// AI:
// addUser adds a new user to the database.
func addUser(u User) error { ... }

// Human (unexported):
func addUser(u User) error { ... }
```

### 2. Verbose receiver names
AI uses `self`, `this`, or full type names. Real Go uses 1-2
letter receivers, same letter across every method on that type.

```go
// AI:
func (user *User) Save() error { ... }
func (user *User) Delete() error { ... }

// Human:
func (u *User) Save() error { ... }
func (u *User) Delete() error { ... }
```

### 3. Long variable names in short scope
```go
// AI:
for index, userObject := range userList {
    fmt.Println(index, userObject.Name)
}

// Human:
for i, u := range users {
    fmt.Println(i, u.Name)
}
```

### 4. Else after return
golangci-lint flags this. AI still writes it.

```go
// AI:
if err != nil {
    return err
} else {
    process(data)
    return nil
}

// Human:
if err != nil {
    return err
}
process(data)
return nil
```

### 5. Error wrapping theater
AI wraps every error with redundant context. Wrap only when adding
context the caller can't derive.

```go
// AI:
if err != nil {
    return fmt.Errorf("failed to call function processUser: %w", err)
}

// Human:
if err != nil {
    return err
}
```

Wrap when context is genuinely useful:

```go
// Acceptable wrap:
if err != nil {
    return fmt.Errorf("read config %s: %w", path, err)
}
```

### 6. Premature interfaces
AI creates `UserRepository` interface with one implementation "for
testability." Delete it. Test the concrete type. Add the interface
when there's a real second implementation.

Go idiom: **accept interfaces, return structs.** Don't invent
interfaces nobody asked for.

### 7. Constructor functions for empty structs
```go
// AI:
func NewConfig() *Config {
    return &Config{}
}

// Human (at call site):
cfg := &Config{}
```

Use `NewX` only when construction has real logic — defaults,
validation, dependency injection.

### 8. Pointer receivers on everything
AI uses `func (u *User)` always. Use value receivers on small
structs that don't mutate. Pointer receivers when: mutating, large
struct, or the type already uses pointer receivers elsewhere.

### 9. Defensive nil checks on impossible cases
```go
// AI:
func greet(name string) string {
    if name == "" {
        return ""
    }
    return "hello " + name
}

// Strings can't be nil. Empty strings aren't a problem here.
// Human:
func greet(name string) string {
    return "hello " + name
}
```

Drop nil checks for slices being ranged over (`range nil` works
fine), strings (can't be nil), and parameters you control.

### 10. Stuttering names
```go
// AI:
package user

type UserConfig struct {
    UserID   string
    UserName string
}

// Human:
package user

type Config struct {
    ID   string
    Name string
}
```

Package name provides context. `user.Config`, not `user.UserConfig`.

### 11. Overusing `any` / `interface{}`
AI reaches for `any` when a concrete type works. Use the specific
type.

### 12. Comments restating the function signature
```go
// AI:
// GetUser gets a user by ID.
func GetUser(id string) (*User, error) { ... }

// Human (drop the comment, or make it useful):
// GetUser returns ErrNotFound when id doesn't exist.
func GetUser(id string) (*User, error) { ... }
```

### 13. Single-use variables
```go
// AI:
result := compute(x)
return result

// Human:
return compute(x)
```

### 14. make() cargo-culted everywhere
```go
// AI (when you don't need preallocation):
result := make([]string, 0, len(input))
for _, x := range input {
    result = append(result, x)
}

// Human:
result := make([]string, len(input))
for i, x := range input {
    result[i] = x
}
```

### 15. Goroutine/channel overuse
AI reaches for `go func() {...}()` and channels where a plain call
works. Use concurrency when there's actual concurrency to exploit.
`sync.Mutex` or `sync.WaitGroup` is often clearer than channels
for simple coordination.

### 16. Returning error as the only return
Not everything needs an `error` return. Sometimes a `bool` or a
panic-on-misuse is more idiomatic.

```go
// AI:
func validate(x int) error {
    if x < 0 {
        return errors.New("negative number")
    }
    return nil
}

// Often better:
func valid(x int) bool { return x >= 0 }
```

### 17. Excessive logging
```go
// AI:
func process(data []byte) error {
    log.Println("Starting to process data")
    log.Printf("Data length: %d", len(data))
    result, err := parse(data)
    if err != nil {
        log.Printf("Failed to parse: %v", err)
        return err
    }
    log.Println("Data processed successfully")
    return result
}

// Human:
func process(data []byte) error {
    _, err := parse(data)
    return err
}
```

Log at boundaries (HTTP handlers, job entry/exit) and on errors.
Not every step.

### 18. Var blocks for constants
```go
// AI:
var (
    maxRetries = 3
    timeout    = 5 * time.Second
)

// Human:
const (
    maxRetries = 3
    timeout    = 5 * time.Second
)
```

Use `const` when the value never changes.

### 19. Verbose error messages
```go
// AI:
return fmt.Errorf("an error occurred while attempting to process user request: %w", err)

// Human:
return fmt.Errorf("process user: %w", err)
```

Short, context-providing error messages. Not narrative ones.

### 20. Unused imports "for future use"
AI sometimes adds imports it doesn't end up using. Real Go won't
compile with unused imports anyway (`goimports` strips them), but
the tell is when AI adds them in the first place. Strip any import
that isn't used in the final code.

---

## Google Go Style Guide tells

These are common naming and structure patterns AI gets wrong by
Google's published Go style guidelines.

### 21. `Get` prefix on getters
Go has no `Get` convention. The getter is named after what it
returns.

```go
// AI:
func (c *Config) GetName() string { return c.name }
func (c *Config) GetTimeout() time.Duration { return c.timeout }

// Human:
func (c *Config) Name() string { return c.name }
func (c *Config) Timeout() time.Duration { return c.timeout }
```

### 22. Repeating package name in function names
```go
// AI:
package yamlconfig

func ParseYAMLConfig(input string) (*Config, error) { ... }

// Human:
package yamlconfig

func Parse(input string) (*Config, error) { ... }
```

Call site reads as `yamlconfig.Parse(input)` — the package already
provides context.

### 23. Repeating receiver type in method names
```go
// AI:
func (c *Config) WriteConfigTo(w io.Writer) (int64, error) { ... }

// Human:
func (c *Config) WriteTo(w io.Writer) (int64, error) { ... }
```

### 24. Repeating parameter names in function names
```go
// AI:
func OverrideFirstWithSecond(dest, source *Config) error { ... }

// Human:
func Override(dest, source *Config) error { ... }
```

### 25. Repeating return type in function names
```go
// AI:
func TransformToJSON(input *Config) *jsonconfig.Config { ... }

// Human:
func Transform(input *Config) *jsonconfig.Config { ... }
```

### 26. Util / helper / common package names
AI loves `package util`, `package helper`, `package common`. Real
Go names packages by what they provide.

```go
// AI:
import "myproject/util"
util.SeekStart

// Human:
import "io"
io.SeekStart
```

### 27. var = X for non-zero initialization
```go
// AI:
var i = 42
var name = "alice"

// Human:
i := 42
name := "alice"
```

Reserve `var` for zero-value declarations.

### 28. Composite literals for zero values
```go
// AI:
coords := Point{X: 0, Y: 0}
magic := [4]byte{0, 0, 0, 0}

// Human:
var coords Point
var magic [4]byte
```

### 29. Multi-line strings built with concatenation
```go
// AI:
usage := "Usage:\n" +
    "\n" +
    "custom_tool [args]"

// Human:
usage := `Usage:

custom_tool [args]`
```

### 30. Unspecified channel direction
```go
// AI:
func sum(values chan int) int { ... }

// Human:
func sum(values <-chan int) int { ... }
```

### 31. String-matching error messages
AI checks errors by string content.

```go
// AI:
if regexp.MatchString(`duplicate`, err.Error()) { ... }

// Human:
if errors.Is(err, ErrDuplicate) { ... }
```

### 32. Duplicate error annotation
AI adds context that the underlying error already includes.

```go
// AI:
if err := os.Open("settings.txt"); err != nil {
    return fmt.Errorf("could not open settings.txt: %v", err)
}
// Output: could not open settings.txt: open settings.txt: no such file...

// Human:
if err := os.Open("settings.txt"); err != nil {
    return fmt.Errorf("load settings: %v", err)
}
// Output: load settings: open settings.txt: no such file...
```

### 33. %w placed at the wrong spot in error strings
Put `%w` at the end so chain reads naturally:

```go
// AI:
return fmt.Errorf("%w: failed to read config file %s", err, path)

// Human:
return fmt.Errorf("read config %s: %w", path, err)
```

Exception: for sentinel errors, `%w` at the start makes the
category visible first:

```go
return fmt.Errorf("%w: invalid header", ErrParse)
```

---

## Process

1. Read the Go file.
2. Identify which tells from the 20 apply.
3. Apply changes. Keep diffs minimal — style only, no logic
   changes.
4. Mentally walk through: same inputs produce same outputs, same
   errors propagate, same goroutines coordinate the same way.
5. Run `gofmt -l` and `go vet` mentally — output must be clean.
6. Re-read once. If anything looks too uniform or symmetric,
   loosen it slightly.

---

## What NOT to do

- Don't introduce bugs to look human. Off-by-ones, nil panics,
  ignored errors — those are bugs, not style.
- Don't add typos. `gopls` flags them.
- Don't add `// I'll fix this later` comments. Performative
  imperfection reads as fake.
- Don't break `gofmt`. Run it mentally.
- Don't strip real error handling — only the wrapping theater.
- Don't change exported APIs without being asked.
- Don't remove security checks, validation, or auth logic.
- Don't change package structure or file layout.

---

## Honest caveat

This skill removes the most obvious AI patterns from Go code. It
does NOT guarantee any AI-detection tool will fail to flag the
output. AI code detectors are unreliable in both directions, and
no "humanizer" can promise 100%.

What this skill gives you: code that reads naturally to another
Go developer. That's the realistic goal.

---

## Quick before/after

**Before (AI-generated):**

```go
// processUserData processes user data and returns a result.
// It takes a userID string and a dataObject map.
func processUserData(userID string, dataObject map[string]interface{}) (*ResultObject, error) {
    if userID == "" {
        return nil, errors.New("userID cannot be empty")
    }
    if dataObject == nil {
        return nil, errors.New("dataObject cannot be nil")
    }

    log.Printf("Starting to process data for user: %s", userID)

    resultObject, err := computeResult(userID, dataObject)
    if err != nil {
        return nil, fmt.Errorf("failed to compute result for user %s: %w", userID, err)
    }

    log.Printf("Successfully processed data for user: %s", userID)
    return resultObject, nil
}
```

**After (humanized):**

```go
func process(userID string, data map[string]any) (*Result, error) {
    if userID == "" {
        return nil, errors.New("empty userID")
    }
    r, err := compute(userID, data)
    if err != nil {
        return nil, fmt.Errorf("compute: %w", err)
    }
    return r, nil
}
```

Same behavior. Half the lines. Reads like a Gopher wrote it.
