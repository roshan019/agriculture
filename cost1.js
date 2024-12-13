$(document).ready(function () {
    let totalExpense = 0; // Initialize total expense
    let totalIncome = 0; // Initialize total income

    $("#product-select").on("change", function () {
        var selectedProduct = $(this).val();
        $("#product-title").text(selectedProduct + " Total Profit ℹ️");
        $("#income-title").text("Income ₹" + totalIncome);
    });

    // Calculate profit when yield, price, or expenses change
    function calculateProfit() {
        var yieldValue = parseFloat($("#yield").val()) || 0;
        var priceValue = parseFloat($("#price").val()) || 0;

        // Calculate income
        totalIncome = yieldValue * priceValue;

        // Calculate profit
        var profit = totalIncome - totalExpense;

        // Update UI
        $("#income").text(totalIncome.toFixed(2));
        $("#total-profit").text(profit.toFixed(2));
        $("#totalExpense").text((-totalExpense).toFixed(2)); // Display total expense as negative
    }

    $("#yield, #price").on("input", calculateProfit);

    document.getElementById("expenseForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        const category = document.getElementById("category").value;
        const name = document.getElementById("name").value;
        const price = document.getElementById("expense-price").value;
        const date = document.getElementById("date").value;

        if (price) {
            const expense = {
                category: category,
                name: name,
                price: parseFloat(price),
                date: date,
            };

            // Update total expense
            totalExpense += expense.price;
            document.getElementById("totalExpense").innerText = (-totalExpense).toFixed(2); // Update displayed total expense as negative

            // Mock API call (replace with your actual API endpoint)
            fetch("https://example.com/api/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expense),
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Expense added:", data);
                // Optionally, reset the form or show a success message
                document.getElementById("expenseForm").reset();
                calculateProfit(); // Recalculate profit after adding expense
            })
            .catch((error) => {
                console.error("Error adding expense:", error);
                alert("There was a problem adding the expense. Please try again.");
            });
        } else {
            alert("Please enter a valid price.");
        }
    });

    document.getElementById("cancelBtn").addEventListener("click", function () {
        document.getElementById("expenseForm").reset();
    });
});