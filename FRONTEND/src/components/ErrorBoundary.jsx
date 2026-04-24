import React from 'react';
import { Container, Button } from 'react-bootstrap';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Container className="text-center mt-5 py-5">
                    <div className="error-boundary">
                        <h2>Something went wrong!</h2>
                        <p>We're sorry, but something unexpected happened.</p>
                        <Button variant="danger" onClick={this.handleReload}>
                            Reload Page
                        </Button>
                    </div>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;