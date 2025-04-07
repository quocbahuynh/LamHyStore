"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Alert, Button, Container } from "react-bootstrap";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Alert variant="danger" className="text-center">
        <h2 className="mb-3">Đã xảy ra lỗi!</h2>
      </Alert>
      <Button variant="primary" onClick={() => reset()}>
        Tải lại
      </Button>
    </Container>
  );
}
