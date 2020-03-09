<script>
export default {
    name: '404',
    layout: 'blank',

    render(h) {
        return <div class="container not-found-page">
            <div class="row">
                <div class="col-md-5">
                    <div class="not-found-page__ms-logo">
                        <img src="/images/logo.svg" />
                    </div>
                    <h3 class="not-found-page__heading">Page not found</h3>
                    <p class="not-found-page__description">Sorry, we couldn't find the page you were looking for.We suggest that you return to main page </p>
                    <div class="not-found-page__return">
                        <button class="btn return-button">Go to home page</button>
                    </div>
                </div>
                <div class="col-md-7 right-side">
                    <img src="/images/not-found.png" />
                </div>
            </div>
        </div>;
    }
};
</script>