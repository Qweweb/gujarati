import sys

try:
    with open('src/components/DigitalCard.jsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Let's find all occurrences of "const handleAddProduct = () => {"
    # We want to keep the one around index 1529 (the updated one) and remove the one around 1719 (the old one).
    import re

    # Remove the block starting with "  // Add items handler\n  const handleAddProduct = () => {"
    # and ending with "triggerLocalToast(\"📸 ગેલેરી આઇટમ ઉમેરાઈ ગઈ!\");\n  };\n"
    # Wait, the one at 1529 also starts with "  // Add items handler\n  const handleAddProduct"
    
    # We know the second one doesn't have the editProductId logic.
    
    # We can just split the file by "  // Add items handler"
    parts = content.split("  // Add items handler")
    
    if len(parts) == 3:
        # parts[0] is everything before first
        # parts[1] is the first handler (the good one with editProductId logic)
        # parts[2] is the second handler (the bad one)
        
        # We need to remove the bad handler from parts[2].
        # It ends at "triggerLocalToast("📸 ગેલેરી આઇટમ ઉમેરાઈ ગઈ!");\n  };"
        
        bad_handler_end = "triggerLocalToast(\"📸 ગેલેરી આઇટમ ઉમેરાઈ ગઈ!\");\n  };\n"
        end_idx = parts[2].find(bad_handler_end)
        
        if end_idx != -1:
            rest_of_file = parts[2][end_idx + len(bad_handler_end):]
            new_content = parts[0] + "  // Add items handler" + parts[1] + rest_of_file
            
            with open('src/components/DigitalCard.jsx', 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Successfully removed duplicate handler.")
        else:
            print("Could not find end of bad handler.")
    else:
        print(f"Found {len(parts)-1} handlers, expected 2.")

except Exception as e:
    print("Error:", e)
