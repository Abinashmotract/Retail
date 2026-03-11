/* eslint-disable react/jsx-key */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Button,
  Paper,
  Chip,
  Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

type FieldType = "TEXT" | "LIST" | "RADIO";

type FieldConfig = {
  id: number;
  name: string;
  fieldType: FieldType;
  minLength?: number;
  maxLength?: number;
  defaultValue?: string;
  required?: boolean;
  listOfValues1?: string[];
};

type FormConfig = {
  data: FieldConfig[];
};

const FORM_CONFIG: FormConfig = {
  data: [
    {
      id: 1,
      name: "Full Name",
      fieldType: "TEXT",
      minLength: 1,
      maxLength: 100,
      defaultValue: "John Doe",
      required: true,
    },
    {
      id: 2,
      name: "Email",
      fieldType: "TEXT",
      minLength: 1,
      maxLength: 50,
      defaultValue: "hello@mail.com",
      required: true,
    },
    {
      id: 6,
      name: "Gender",
      fieldType: "LIST",
      defaultValue: "Male",
      required: true,
      listOfValues1: ["Male", "Female", "Others"],
    },
    {
      id: 7,
      name: "Love React?",
      fieldType: "RADIO",
      defaultValue: "Yes",
      required: true,
      listOfValues1: ["Yes", "No"],
    },
  ],
};

type SignupFormValues = Record<string, string>;

type Submission = {
  createdAt: string;
  values: SignupFormValues;
};

const STORAGE_KEY = "dynamic-signup-submissions";

function loadSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    // Backwards compatibility if older shape (plain form values array) exists
    if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0]?.values) {
      return (parsed as SignupFormValues[]).map((values) => ({
        createdAt: new Date().toISOString(),
        values,
      }));
    }

    return parsed as Submission[];
  } catch {
    return [];
  }
}

function saveSubmissions(submissions: Submission[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

export default function Home() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    setSubmissions(loadSubmissions());
  }, []);

  const defaultValues = useMemo(
    () =>
      FORM_CONFIG.data.reduce<Record<string, string>>((acc, field) => {
        acc[field.name] = field.defaultValue ?? "";
        return acc;
      }, {}),
    [],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues,
    mode: "onBlur",
  });

  const onSubmit = (values: SignupFormValues) => {
    const next: Submission[] = [
      ...submissions,
      {
        createdAt: new Date().toISOString(),
        values,
      },
    ];
    setSubmissions(next);
    saveSubmissions(next);
    reset(defaultValues);
  };

  const renderField = (field: FieldConfig) => {
    const name = field.name;
    const label = field.name;
    const required = field.required ?? false;
    const options = field.listOfValues1 ?? [];

    switch (field.fieldType) {
      case "TEXT":
        return (
          <Controller
            key={field.id}
            name={name}
            control={control}
            rules={{
              required: required ? `${label} is required` : false,
              minLength: field.minLength
                ? {
                    value: field.minLength,
                    message: `${label} must be at least ${field.minLength} characters`,
                  }
                : undefined,
              maxLength: field.maxLength
                ? {
                    value: field.maxLength,
                    message: `${label} must be at most ${field.maxLength} characters`,
                  }
                : undefined,
            }}
            render={({ field: rhfField }) => (
              <TextField
                {...rhfField}
                fullWidth
                label={label}
                margin="normal"
                variant="outlined"
                required={required}
                error={!!errors[name]}
                helperText={errors[name]?.message as string | undefined}
              />
            )}
          />
        );
      case "LIST":
        return (
          <Controller
            key={field.id}
            name={name}
            control={control}
            rules={{
              required: required ? `${label} is required` : false,
            }}
            render={({ field: rhfField }) => (
              <FormControl
                fullWidth
                margin="normal"
                required={required}
                error={!!errors[name]}
              >
                <InputLabel>{label}</InputLabel>
                <Select
                  {...rhfField}
                  label={label}
                  value={rhfField.value || ""}
                >
                  {options.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {(errors[name]?.message as string | undefined) ?? ""}
                </FormHelperText>
              </FormControl>
            )}
          />
        );
      case "RADIO":
        return (
          <Controller
            key={field.id}
            name={name}
            control={control}
            rules={{
              required: required ? `${label} is required` : false,
            }}
            render={({ field: rhfField }) => (
              <FormControl
                margin="normal"
                required={required}
                error={!!errors[name]}
              >
                <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                  {label}
                </Typography>
                <RadioGroup
                  {...rhfField}
                  row
                  value={rhfField.value || ""}
                >
                  {options.map((opt) => (
                    <FormControlLabel
                      key={opt}
                      value={opt}
                      control={<Radio />}
                      label={opt}
                    />
                  ))}
                </RadioGroup>
                <FormHelperText>
                  {(errors[name]?.message as string | undefined) ?? ""}
                </FormHelperText>
              </FormControl>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#f3f4f6" : "background.default",
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Dynamic Signup Form
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Fields, labels, and input types are fully driven by JSON
                configuration. Update the JSON and the UI adapts automatically.
              </Typography>
            </Box>

            <Box
              component={Paper}
              elevation={4}
              sx={{
                p: { xs: 2.5, md: 4 },
                borderRadius: 3,
                backdropFilter: "blur(8px)",
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Signup Details
              </Typography>

              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                sx={{ mt: 1 }}
              >
                {FORM_CONFIG.data.map((field) => renderField(field))}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => reset(defaultValues)}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box
              component={Paper}
              elevation={1}
              sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}
            >
              <Box mb={1}>
                <Typography variant="h6" fontWeight={600}>
                  Recent Submissions
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Showing your latest saved entries in a clean timeline.
                </Typography>
              </Box>

              {submissions.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No submissions yet. Fill the form and hit submit to see data
                  persisted via local storage.
                </Typography>
              ) : (
                <Stack spacing={2} sx={{ mt: 1 }}>
                  {submissions
                    .slice()
                    .reverse()
                    .map((submission, index) => {
                      const created = new Date(submission.createdAt);
                      const now = new Date();
                      const isToday =
                        created.toDateString() === now.toDateString();
                      const timeLabel = created.toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                      });
                      const dateLabel = isToday
                        ? "Today"
                        : created.toLocaleDateString();

                      const values = submission.values;
                      const fullName =
                        values["Full Name"] ?? values["Name"] ?? "-";

                      return (
                        <Paper
                          key={`${submission.createdAt}-${index}`}
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            p: 2,
                            bgcolor: "background.default",
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mb: 1 }}
                          >
                            Submitted: {timeLabel} - {dateLabel}
                          </Typography>
                          <Box
                            sx={{
                              borderTop: "1px solid",
                              borderColor: "divider",
                              pt: 1.5,
                            }}
                          >
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>Full Name:</strong>{" "}
                              <Typography
                                component="span"
                                color="primary"
                                sx={{ fontWeight: 500 }}
                              >
                                {fullName}
                              </Typography>
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>Email:</strong>{" "}
                              <Typography
                                component="span"
                                color="primary"
                                sx={{ textDecoration: "underline" }}
                              >
                                {values["Email"] ?? "-"}
                              </Typography>
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                              <strong>Gender:</strong>{" "}
                              {values["Gender"] ?? "-"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Love React?:</strong>{" "}
                              {values["Love React?"] ?? "-"}
                            </Typography>
                          </Box>
                        </Paper>
                      );
                    })}
                </Stack>
              )}
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

